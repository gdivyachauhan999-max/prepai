package com.prepai.backend.dto;

import java.time.LocalDateTime;

public class InterviewListItemResponse {

    private Long interviewId;
    private String domain;
    private Double overallScore;
    private LocalDateTime completedAt;
    private String status;

    public InterviewListItemResponse(Long interviewId, String domain, Double overallScore, LocalDateTime completedAt, String status) {
        this.interviewId = interviewId;
        this.domain = domain;
        this.overallScore = overallScore;
        this.completedAt = completedAt;
        this.status = status;
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}