package com.prepai.backend.dto;

public class StartInterviewResponse {

    private Long interviewId;
    private QuestionResponse question;

    public StartInterviewResponse(Long interviewId, QuestionResponse question) {
        this.interviewId = interviewId;
        this.question = question;
    }

    public Long getInterviewId() {
        return interviewId;
    }

    public void setInterviewId(Long interviewId) {
        this.interviewId = interviewId;
    }

    public QuestionResponse getQuestion() {
        return question;
    }

    public void setQuestion(QuestionResponse question) {
        this.question = question;
    }
}