package com.prepai.backend.dto;

public class SubmitAnswerResponse {

    private FeedbackResponse feedback;
    private QuestionResponse nextQuestion;
    private boolean completed;
    private Double overallScore;

    public SubmitAnswerResponse(FeedbackResponse feedback, QuestionResponse nextQuestion, boolean completed, Double overallScore) {
        this.feedback = feedback;
        this.nextQuestion = nextQuestion;
        this.completed = completed;
        this.overallScore = overallScore;
    }

    public FeedbackResponse getFeedback() {
        return feedback;
    }

    public void setFeedback(FeedbackResponse feedback) {
        this.feedback = feedback;
    }

    public QuestionResponse getNextQuestion() {
        return nextQuestion;
    }

    public void setNextQuestion(QuestionResponse nextQuestion) {
        this.nextQuestion = nextQuestion;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }
}