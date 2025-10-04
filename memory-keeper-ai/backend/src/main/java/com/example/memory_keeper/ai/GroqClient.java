package com.example.memory_keeper.ai;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
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
     * Call Groq API with custom system and user prompts
     */
    public String chat(String systemPrompt, String userMessage) throws IOException {
        return chat(systemPrompt, userMessage, 0.7, 1000);
    }

    /**
     * Advanced call with temperature and max tokens control
     */
    public String chat(String systemPrompt, String userMessage, double temperature, int maxTokens) throws IOException {

        String jsonBody = String.format(
                "{\"model\": \"%s\"," +
                        "\"messages\": [" +
                        "{\"role\": \"system\", \"content\": %s}," +
                        "{\"role\": \"user\", \"content\": %s}" +
                        "]," +
                        "\"temperature\": %.1f," +
                        "\"max_tokens\": %d}",
                model,
                objectMapper.writeValueAsString(systemPrompt),
                objectMapper.writeValueAsString(userMessage),
                temperature,
                maxTokens
        );

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
            if (!response.isSuccessful()) {
                log.error("Groq API failed: {}", response.code());
                throw new IOException("Groq API call failed: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            return jsonResponse
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();
        }
    }

    /**
     * Stream response for real-time output (WebSocket)
     */
    public void chatStream(String systemPrompt, String userMessage, StreamCallback callback) {
        // Implementation for streaming responses
        // Useful for real-time chatbot experience
    }

    @FunctionalInterface
    public interface StreamCallback {
        void onChunk(String chunk);
    }
}