// src/main/java/com/example/memory_keeper/ai/HuggingFaceClient.java
package com.example.memory_keeper.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Hugging Face Client (FINAL VERSION)
 *
 * Provides multiple FREE AI functionalities:
 * 1. Sentiment Analysis (Positive/Negative/Neutral)
 * 2. Emotion Detection (Joy, Sadness, etc.)
 * 3. Image Generation (Stable Diffusion)
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class HuggingFaceClient {

    @Value("${ai.huggingface.api-key}")
    private String apiKey;

    @Value("${ai.huggingface.api-url}")
    private String baseUrl;

    private final ObjectMapper objectMapper;

    // Use a shared OkHttpClient with longer timeouts for AI models
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS) // Increased for image generation
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    /**
     * Analyze sentiment of text using a reliable RoBERTa model.
     */
    public Map<String, Object> analyzeSentiment(String text) throws IOException {
        String modelUrl = baseUrl + "/cardiffnlp/twitter-roberta-base-sentiment-latest";
        log.info("Calling HuggingFace sentiment analysis at: {}", modelUrl);
        String jsonBody = objectMapper.writeValueAsString(Map.of("inputs", text));
        Request request = buildPostRequest(modelUrl, jsonBody);

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                log.error("HuggingFace sentiment API failed with status: {}. Body: {}", response.code(), responseBody);
                throw new IOException("Sentiment analysis failed: " + response.code());
            }

            JsonNode jsonArray = objectMapper.readTree(responseBody);
            if (jsonArray.isArray() && !jsonArray.isEmpty() && jsonArray.get(0).isArray() && !jsonArray.get(0).isEmpty()) {
                JsonNode topResult = jsonArray.get(0).get(0);
                String label = topResult.get("label").asText();
                double score = topResult.get("score").asDouble();
                Map<String, Object> result = new HashMap<>();
                result.put("label", label.toUpperCase());
                result.put("score", score);
                log.info("Sentiment result: {}", result);
                return result;
            } else {
                log.error("Unexpected sentiment response format: {}", responseBody);
                throw new IOException("Could not parse sentiment from HuggingFace response.");
            }
        }
    }

    /**
     * Detect multiple emotions in a given text.
     */
    public JsonNode detectEmotions(String text) throws IOException {
        String modelUrl = baseUrl + "/j-hartmann/emotion-english-distilroberta-base";
        log.info("Calling HuggingFace emotion detection at: {}", modelUrl);
        String jsonBody = objectMapper.writeValueAsString(Map.of("inputs", text));
        Request request = buildPostRequest(modelUrl, jsonBody);

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                log.error("HuggingFace emotion API failed with status: {}. Body: {}", response.code(), responseBody);
                throw new IOException("Emotion detection failed: " + response.code());
            }

            JsonNode jsonArray = objectMapper.readTree(responseBody);
            if (jsonArray.isArray() && !jsonArray.isEmpty()) {
                return jsonArray.get(0);
            } else {
                log.error("Unexpected emotion response format: {}", responseBody);
                throw new IOException("Could not parse emotions from HuggingFace response.");
            }
        }
    }

    /**
     * Generate Image using a FREE and STABLE Hugging Face Model.
     * This is the final, corrected version.
     */
    public byte[] generateImage(String prompt) throws IOException {

        // --- START OF FIX ---
        // Using a more stable and consistently available model to avoid 404 errors.
        String modelUrl = baseUrl + "/Lykon/dreamshaper-xl-turbo";
        // --- END OF FIX ---

        String fullPrompt = prompt + ", nostalgic, vintage photo, heartwarming, soft lighting, detailed, high quality, masterpiece";
        String jsonBody = objectMapper.writeValueAsString(Map.of("inputs", fullPrompt));
        Request request = buildPostRequest(modelUrl, jsonBody);

        log.info("Calling Hugging Face image generation at URL: {}", modelUrl);
        log.info("Image prompt: {}", fullPrompt);

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No response body";
                log.error("Hugging Face image generation failed with status: {}. Body: {}", response.code(), errorBody);
                if (response.code() == 503) {
                    throw new IOException("Image generation model is currently loading on Hugging Face's servers. Please try again in a moment.");
                }
                throw new IOException("Hugging Face image generation failed with status code: " + response.code());
            }

            byte[] imageBytes = response.body().bytes();
            if (imageBytes == null || imageBytes.length < 1000) { // Check if the response is a valid image
                log.error("Hugging Face returned an invalid or empty image. Response might be an error JSON instead of an image.");
                throw new IOException("Received invalid image data from Hugging Face.");
            }
            return imageBytes;
        }
    }

    /**
     * Helper method to build a standardized POST request with authorization.
     */
    private Request buildPostRequest(String url, String jsonBody) {
        RequestBody body = RequestBody.create(jsonBody, MediaType.parse("application/json"));
        Request.Builder requestBuilder = new Request.Builder().url(url).post(body);

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer " + apiKey);
        } else {
            log.warn("HuggingFace API key is not set. Some models may fail.");
        }

        return requestBuilder.build();
    }
}