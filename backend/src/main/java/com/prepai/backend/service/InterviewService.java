package com.prepai.backend.service;

import com.prepai.backend.dto.*;
import com.prepai.backend.exception.ApiException;
import com.prepai.backend.model.*;
import com.prepai.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private static final int QUESTIONS_PER_SESSION = 5;

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public InterviewService(InterviewRepository interviewRepository,
                             QuestionRepository questionRepository,
                             AnswerRepository answerRepository,
                             FeedbackRepository feedbackRepository,
                             UserRepository userRepository,
                             GeminiService geminiService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public StartInterviewResponse startInterview(String userEmail, StartInterviewRequest request) {
        User user = getUser(userEmail);

        Interview interview = new Interview(user, request.getDomain());
        interviewRepository.save(interview);

        GeminiService.GeneratedQuestion generated = geminiService.generateQuestion(request.getDomain(), List.of());
        Question question = new Question(interview, generated.text, 1);
        questionRepository.save(question);

        return new StartInterviewResponse(
                interview.getId(),
                new QuestionResponse(question.getId(), question.getQuestionText(), question.getOrderIndex())
        );
    }

    @Transactional(readOnly = true)
    public QuestionResponse getCurrentQuestion(String userEmail, Long interviewId) {
        Interview interview = getOwnedInterview(userEmail, interviewId);

        if ("COMPLETED".equals(interview.getStatus())) {
            throw new ApiException("Interview already completed", HttpStatus.CONFLICT);
        }

        List<Question> questions = questionRepository.findByInterviewOrderByOrderIndexAsc(interview);
        Question latest = questions.get(questions.size() - 1);

        return new QuestionResponse(latest.getId(), latest.getQuestionText(), latest.getOrderIndex());
    }

    @Transactional
    public SubmitAnswerResponse submitAnswer(String userEmail, Long interviewId, SubmitAnswerRequest request) {
        Interview interview = getOwnedInterview(userEmail, interviewId);

        if ("COMPLETED".equals(interview.getStatus())) {
            throw new ApiException("Interview already completed", HttpStatus.CONFLICT);
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new ApiException("Question not found", HttpStatus.NOT_FOUND));

        if (!question.getInterview().getId().equals(interview.getId())) {
            throw new ApiException("Question does not belong to this interview", HttpStatus.BAD_REQUEST);
        }

        if (answerRepository.findByQuestion(question).isPresent()) {
            throw new ApiException("This question has already been answered", HttpStatus.BAD_REQUEST);
        }

        Answer answer = new Answer(question, request.getAnswerText());
        answerRepository.save(answer);

        GeminiService.GeneratedFeedback generated = geminiService.generateFeedback(
                question.getQuestionText(), request.getAnswerText()
        );

        Feedback feedback = new Feedback(answer, generated.score, generated.strengths,
                generated.weaknesses, generated.improvementTip);
        feedbackRepository.save(feedback);

        FeedbackResponse feedbackResponse = new FeedbackResponse(
                generated.score, generated.strengths, generated.weaknesses, generated.improvementTip
        );

        long answeredCount = questionRepository.countByInterview(interview);

        if (answeredCount < QUESTIONS_PER_SESSION) {
            List<String> previousQuestions = questionRepository.findByInterviewOrderByOrderIndexAsc(interview)
                    .stream().map(Question::getQuestionText).collect(Collectors.toList());

            GeminiService.GeneratedQuestion nextGenerated = geminiService.generateQuestion(
                    interview.getDomain(), previousQuestions
            );

            Question nextQuestion = new Question(interview, nextGenerated.text, (int) answeredCount + 1);
            questionRepository.save(nextQuestion);

            QuestionResponse nextQuestionResponse = new QuestionResponse(
                    nextQuestion.getId(), nextQuestion.getQuestionText(), nextQuestion.getOrderIndex()
            );

            return new SubmitAnswerResponse(feedbackResponse, nextQuestionResponse, false, null);

        } else {
            double overallScore = calculateOverallScore(interview);
            interview.setOverallScore(BigDecimal.valueOf(overallScore).setScale(2, RoundingMode.HALF_UP));
            interview.setStatus("COMPLETED");
            interview.setCompletedAt(LocalDateTime.now());
            interviewRepository.save(interview);

            return new SubmitAnswerResponse(feedbackResponse, null, true, overallScore);
        }
    }

    @Transactional(readOnly = true)
    public InterviewSummaryResponse getSummary(String userEmail, Long interviewId) {
        Interview interview = getOwnedInterview(userEmail, interviewId);

        List<Question> questions = questionRepository.findByInterviewOrderByOrderIndexAsc(interview);

        List<InterviewSummaryResponse.QuestionSummaryItem> items = questions.stream().map(q -> {
            Answer answer = answerRepository.findByQuestion(q).orElse(null);
            String answerText = answer != null ? answer.getAnswerText() : null;

            FeedbackResponse feedbackResponse = null;
            if (answer != null) {
                Feedback fb = feedbackRepository.findByAnswer(answer).orElse(null);
                if (fb != null) {
                    feedbackResponse = new FeedbackResponse(fb.getScore(), fb.getStrengths(),
                            fb.getWeaknesses(), fb.getImprovementTip());
                }
            }

            return new InterviewSummaryResponse.QuestionSummaryItem(q.getQuestionText(), answerText, feedbackResponse);
        }).collect(Collectors.toList());

        Double overallScore = interview.getOverallScore() != null ? interview.getOverallScore().doubleValue() : null;

        return new InterviewSummaryResponse(interview.getId(), interview.getDomain(), overallScore, items);
    }

    @Transactional(readOnly = true)
    public List<InterviewListItemResponse> getHistoryList(String userEmail, String domainFilter) {
        User user = getUser(userEmail);

        List<Interview> interviews = domainFilter != null
                ? interviewRepository.findByUserAndDomainOrderByStartedAtDesc(user, domainFilter)
                : interviewRepository.findByUserOrderByStartedAtDesc(user);

        return interviews.stream().map(i -> new InterviewListItemResponse(
                i.getId(), i.getDomain(),
                i.getOverallScore() != null ? i.getOverallScore().doubleValue() : null,
                i.getCompletedAt(), i.getStatus()
        )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(String userEmail) {
        User user = getUser(userEmail);
        List<Interview> completed = interviewRepository.findByUserOrderByStartedAtDesc(user)
                .stream().filter(i -> "COMPLETED".equals(i.getStatus())).collect(Collectors.toList());

        long total = completed.size();

        Double average = completed.isEmpty() ? null : completed.stream()
                .mapToDouble(i -> i.getOverallScore().doubleValue())
                .average().orElse(0.0);

        Map<String, Double> byDomain = completed.stream()
                .collect(Collectors.groupingBy(Interview::getDomain,
                        Collectors.averagingDouble(i -> i.getOverallScore().doubleValue())));

        return new DashboardSummaryResponse(total, average, byDomain);
    }

    private double calculateOverallScore(Interview interview) {
        List<Question> questions = questionRepository.findByInterviewOrderByOrderIndexAsc(interview);
        double sum = 0;
        int count = 0;
        for (Question q : questions) {
            Answer answer = answerRepository.findByQuestion(q).orElse(null);
            if (answer != null) {
                Feedback fb = feedbackRepository.findByAnswer(answer).orElse(null);
                if (fb != null) {
                    sum += fb.getScore();
                    count++;
                }
            }
        }
        return count > 0 ? sum / count : 0.0;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.UNAUTHORIZED));
    }

    private Interview getOwnedInterview(String userEmail, Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ApiException("Interview not found", HttpStatus.NOT_FOUND));

        if (!interview.getUser().getEmail().equals(userEmail)) {
            throw new ApiException("You do not have access to this interview", HttpStatus.FORBIDDEN);
        }

        return interview;
    }
}