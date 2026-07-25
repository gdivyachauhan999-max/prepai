package com.prepai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class StartInterviewRequest {

    @NotBlank(message = "Domain is required")
    @Pattern(regexp = "JAVA|DSA|WEB_DEVELOPMENT", message = "Domain must be JAVA, DSA, or WEB_DEVELOPMENT")
    private String domain;

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }
}