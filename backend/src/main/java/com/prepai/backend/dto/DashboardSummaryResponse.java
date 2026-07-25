package com.prepai.backend.dto;

import java.util.Map;

public class DashboardSummaryResponse {

    private long totalInterviews;
    private Double averageScore;
    private Map<String, Double> byDomain;

    public DashboardSummaryResponse(long totalInterviews, Double averageScore, Map<String, Double> byDomain) {
        this.totalInterviews = totalInterviews;
        this.averageScore = averageScore;
        this.byDomain = byDomain;
    }

    public long getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(long totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Map<String, Double> getByDomain() {
        return byDomain;
    }

    public void setByDomain(Map<String, Double> byDomain) {
        this.byDomain = byDomain;
    }
}