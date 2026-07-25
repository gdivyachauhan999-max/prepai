package com.prepai.backend.controller;

import com.prepai.backend.dto.*;
import com.prepai.backend.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping("/interviews/start")
    public ResponseEntity<StartInterviewResponse> startInterview(
            Authentication authentication,
            @Valid @RequestBody StartInterviewRequest request) {
        StartInterviewResponse response = interviewService.startInterview(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/interviews/{id}/current-question")
    public ResponseEntity<QuestionResponse> getCurrentQuestion(
            Authentication authentication,
            @PathVariable Long id) {
        QuestionResponse response = interviewService.getCurrentQuestion(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/interviews/{id}/answer")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody SubmitAnswerRequest request) {
        SubmitAnswerResponse response = interviewService.submitAnswer(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interviews/{id}/summary")
    public ResponseEntity<InterviewSummaryResponse> getSummary(
            Authentication authentication,
            @PathVariable Long id) {
        InterviewSummaryResponse response = interviewService.getSummary(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewListItemResponse>> getHistoryList(
            Authentication authentication,
            @RequestParam(required = false) String domain) {
        List<InterviewListItemResponse> response = interviewService.getHistoryList(authentication.getName(), domain);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(Authentication authentication) {
        DashboardSummaryResponse response = interviewService.getDashboardSummary(authentication.getName());
        return ResponseEntity.ok(response);
    }
}