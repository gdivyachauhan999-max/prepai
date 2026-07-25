package com.prepai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prepai.backend.exception.AiServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public GeminiService(WebClient webClient) {
        this.webClient = webClient;
    }

    public static class GeneratedQuestion {
        public String text;
    }

    public static class GeneratedFeedback {
        public int score;
        public String strengths;
        public String weaknesses;
        public String improvementTip;
    }

    public GeneratedQuestion generateQuestion(String domain, List<String> previousQuestions) {
        String domainLabel = mapDomainLabel(domain);
        String previousList = previousQuestions.isEmpty()
                ? "none yet"
                : String.join(" | ", previousQuestions);

        String prompt = "You are a technical interviewer specializing in " + domainLabel + ". "
                + "Ask one concise, realistic interview question suitable for a junior developer. "
                + "Do not repeat any of these previously asked questions: " + previousList + ". "
                + "Return ONLY valid JSON, no markdown code fences, no extra text, in this exact format: "
                + "{\"question\": \"your question here\"}";

        String rawResponse = callGemini(prompt);
        JsonNode json = parseJson(rawResponse);

        GeneratedQuestion result = new GeneratedQuestion();
        result.text = json.get("question").asText();
        return result;
    }

    public GeneratedFeedback generateFeedback(String question, String answer) {
        String prompt = "You are evaluating a junior developer's interview answer. "
                + "Question: \"" + question + "\" "
                + "Answer: \"" + answer + "\" "
                + "Evaluate the answer and return ONLY valid JSON, no markdown code fences, no extra text, "
                + "in this exact format: "
                + "{\"score\": <integer 0-10>, \"strengths\": \"1-2 sentences\", "
                + "\"weaknesses\": \"1-2 sentences\", \"improvementTip\": \"1 practical sentence\"}";

        String rawResponse = callGemini(prompt);
        JsonNode json = parseJson(rawResponse);

        GeneratedFeedback result = new GeneratedFeedback();
        result.score = json.get("score").asInt();
        result.strengths = json.get("strengths").asText();
        result.weaknesses = json.get("weaknesses").asText();
        result.improvementTip = json.get("improvementTip").asText();
        return result;
    }

    private String callGemini(String prompt) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", prompt)))
                    )
            );

            JsonNode response = webClient.post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            return response
                    .get("candidates").get(0)
                    .get("content").get("parts").get(0)
                    .get("text").asText();

        } catch (Exception e) {
            throw new AiServiceException("AI service failed to respond: " + e.getMessage());
        }
    }

    private JsonNode parseJson(String rawText) {
        try {
            String cleaned = rawText
                    .replaceAll("```json", "")
                    .replaceAll("```", "")
                    .trim();
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            throw new AiServiceException("AI returned an unparseable response");
        }
    }

    private String mapDomainLabel(String domain) {
        return switch (domain) {
            case "JAVA" -> "Java programming";
            case "DSA" -> "Data Structures and Algorithms";
            case "WEB_DEVELOPMENT" -> "Web Development";
            default -> domain;
        };
    }
}