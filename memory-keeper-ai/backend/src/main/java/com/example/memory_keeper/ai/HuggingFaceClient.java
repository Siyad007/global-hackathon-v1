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

@Component
@Slf4j
@RequiredArgsConstructor
public class HuggingFaceClient {

    @Value("${ai.huggingface.api-key}")
    private String apiKey;

    @Value("${ai.huggingface.api-url}")
    private String baseUrl;

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient();

    /**
     * Analyze sentiment of text using Twitter RoBERTa model (more reliable)
     */
    public Map<String, Object> analyzeSentiment(String text) throws IOException {
        // Using a more reliable and currently active model
        String modelUrl = baseUrl + "/cardiffnlp/twitter-roberta-base-sentiment-latest";

        log.info("Calling HuggingFace sentiment analysis at: {}", modelUrl);

        String jsonBody = objectMapper.writeValueAsString(
                Map.of("inputs", text)
        );

        Request.Builder requestBuilder = new Request.Builder()
                .url(modelUrl)
                .post(RequestBody.create(jsonBody, MediaType.parse("application/json")));

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                log.error("HuggingFace API failed with status: {}", response.code());
                log.error("Response body: {}", responseBody);
                throw new IOException("Sentiment analysis failed: " + response.code() + " - " + responseBody);
            }

            log.info("HuggingFace response: {}", responseBody);

            JsonNode jsonArray = objectMapper.readTree(responseBody);
            JsonNode firstResult = jsonArray.get(0).get(0);

            // Map the labels: negative, neutral, positive
            String label = firstResult.get("label").asText();
            double score = firstResult.get("score").asDouble();

            Map<String, Object> result = new HashMap<>();
            result.put("label", label.toUpperCase());
            result.put("score", score);

            log.info("Sentiment result: {}", result);
            return result;
        }
    }

    /**
     * Detect multiple emotions
     */
    public JsonNode detectEmotions(String text) throws IOException {
        String modelUrl = baseUrl + "/j-hartmann/emotion-english-distilroberta-base";

        log.info("Calling HuggingFace emotion detection at: {}", modelUrl);

        String jsonBody = objectMapper.writeValueAsString(
                Map.of("inputs", text)
        );

        Request.Builder requestBuilder = new Request.Builder()
                .url(modelUrl)
                .post(RequestBody.create(jsonBody, MediaType.parse("application/json")));

        if (apiKey != null && !apiKey.isEmpty()) {
            requestBuilder.addHeader("Authorization", "Bearer " + apiKey);
        }

        Request request = requestBuilder.build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                log.error("HuggingFace emotion API failed: {}", response.code());
                throw new IOException("Emotion detection failed: " + response.code());
            }

            return objectMapper.readTree(responseBody).get(0);
        }
    }
}