package com.prepai.backend.dto;

import java.util.List;

public class InterviewSummaryResponse {

    private Long interviewId;
    private String domain;
    private Double overallScore;
    private List<QuestionSummaryItem> questions;

    public InterviewSummaryResponse(Long interviewId, String domain, Double overallScore, List<QuestionSummaryItem> questions) {
        this.interviewId = interviewId;
        this.domain = domain;
        this.overallScore = overallScore;
        this.questions = questions;
    }

    public static class QuestionSummaryItem {
        public String text;
        public String answer;
        public FeedbackResponse feedback;

        public QuestionSummaryItem(String text, String answer, FeedbackResponse feedback) {
            this.text = text;
            this.answer = answer;
            this.feedback = feedback;
        }
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Double getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Double overallScore) {
        this.overallScore = overallScore;
    }

    public List<QuestionSummaryItem> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionSummaryItem> questions) {
        this.questions = questions;
    }
}