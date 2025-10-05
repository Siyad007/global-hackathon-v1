// src/main/java/com/example/memory_keeper/ai/GroqClient.java
package com.example.memory_keeper.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Groq AI Client - FREE & FAST!
 *
 * What: Calls Groq API for text generation
 * Why: FREE 30 req/min, uses Llama 3 (very good quality)
 * When: Story enhancement, questions, chat
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class GroqClient {

    @Value("${ai.groq.api-key}")
    private String apiKey;

    @Value("${ai.groq.api-url}")
    private String apiUrl;

    @Value("${ai.groq.model}")
    private String model;

    private final ObjectMapper objectMapper;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    /**
     * Call Groq API with custom system and user prompts.
     */
    public String chat(String systemPrompt, String userMessage) throws IOException {
        return chat(systemPrompt, userMessage, 0.7, 1000);
    }

    /**
     * Advanced call with temperature and max tokens control.
     * This is the FIXED version that prevents the 400 Bad Request error.
     */
    public String chat(String systemPrompt, String userMessage, double temperature, int maxTokens) throws IOException {

        // --- START OF FIX ---

        // 1. Build the request body using a Map for reliable JSON serialization.
        // This avoids manual JSON string formatting and escaping issues.
        Map<String, Object> messageSystem = new HashMap<>();
        messageSystem.put("role", "system");
        messageSystem.put("content", systemPrompt);

        Map<String, Object> messageUser = new HashMap<>();
        messageUser.put("role", "user");
        messageUser.put("content", userMessage);

        List<Map<String, Object>> messages = Arrays.asList(messageSystem, messageUser);

        Map<String, Object> requestBodyMap = new HashMap<>();
        requestBodyMap.put("model", model);
        requestBodyMap.put("messages", messages);
        requestBodyMap.put("temperature", temperature);
        requestBodyMap.put("max_tokens", maxTokens);

        // 2. Convert the Map to a JSON string using ObjectMapper for safety.
        String jsonBody = objectMapper.writeValueAsString(requestBodyMap);

        // --- END OF FIX ---

        RequestBody body = RequestBody.create(
                jsonBody,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            // Read the body once to avoid "closed" errors.
            String responseBody = response.body().string();

            if (!response.isSuccessful()) {
                // Add detailed logging to show the exact error from Groq's server.
                log.error("Groq API call failed with status: {}", response.code());
                log.error("Groq API response body: {}", responseBody);
                throw new IOException("Groq API call failed: " + response.code());
            }

            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            // Safer parsing of the response to prevent NullPointerExceptions.
            if (jsonResponse.has("choices") && jsonResponse.get("choices").isArray() && !jsonResponse.get("choices").isEmpty()) {
                JsonNode choice = jsonResponse.get("choices").get(0);
                if (choice.has("message") && choice.get("message").has("content")) {
                    return choice.get("message").get("content").asText();
                }
            }

            // If the response structure is unexpected, throw a clear error.
            log.error("Unexpected Groq API response structure: {}", responseBody);
            throw new IOException("Could not parse content from Groq API response.");
        }
    }

    /**
     * Stream response for real-time output (WebSocket).
     * This remains a placeholder for future implementation.
     */
    public void chatStream(String systemPrompt, String userMessage, StreamCallback callback) {
        log.warn("chatStream is not yet implemented.");
        // Implementation for streaming responses would go here.
        // Useful for a real-time chatbot experience.
    }

    @FunctionalInterface
    public interface StreamCallback {
        void onChunk(String chunk);
    }
}