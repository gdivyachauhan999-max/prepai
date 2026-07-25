package com.prepai.backend.dto;

public class QuestionResponse {

    private Long id;
    private String text;
    private Integer orderIndex;

    public QuestionResponse(Long id, String text, Integer orderIndex) {
        this.id = id;
        this.text = text;
        this.orderIndex = orderIndex;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}