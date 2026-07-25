package com.prepai.backend.dto;

public class FeedbackResponse {

    private int score;
    private String strengths;
    private String weaknesses;
    private String improvementTip;

    public FeedbackResponse(int score, String strengths, String weaknesses, String improvementTip) {
        this.score = score;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.improvementTip = improvementTip;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(String weaknesses) {
        this.weaknesses = weaknesses;
    }

    public String getImprovementTip() {
        return improvementTip;
    }

    public void setImprovementTip(String improvementTip) {
        this.improvementTip = improvementTip;
    }
}