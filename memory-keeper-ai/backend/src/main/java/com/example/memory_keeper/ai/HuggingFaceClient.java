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

/**
 * Hugging Face Client - FREE Sentiment Analysis
 *
 * What: Analyzes emotions in text
 * Why: FREE unlimited API calls
 * When: After story creation to detect sentiment
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
    private final OkHttpClient client = new OkHttpClient();

    /**
     * Analyze sentiment of text
     * Returns: {label: "POSITIVE", score: 0.95}
     */
    public Map<String, Object> analyzeSentiment(String text) throws IOException {

        String modelUrl = baseUrl + "/distilbert-base-uncased-finetuned-sst-2-english";

        String jsonBody = objectMapper.writeValueAsString(
                Map.of("inputs", text)
        );

        RequestBody body = RequestBody.create(
                jsonBody,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(modelUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Sentiment analysis failed: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode jsonArray = objectMapper.readTree(responseBody);
            JsonNode firstResult = jsonArray.get(0).get(0);

            Map<String, Object> result = new HashMap<>();
            result.put("label", firstResult.get("label").asText());
            result.put("score", firstResult.get("score").asDouble());

            return result;
        }
    }

    /**
     * Detect multiple emotions
     * Returns: [{label: "joy", score: 0.8}, {label: "love", score: 0.6}]
     */
    public JsonNode detectEmotions(String text) throws IOException {

        String modelUrl = baseUrl + "/j-hartmann/emotion-english-distilroberta-base";

        String jsonBody = objectMapper.writeValueAsString(
                Map.of("inputs", text)
        );

        RequestBody body = RequestBody.create(
                jsonBody,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(modelUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            return objectMapper.readTree(responseBody).get(0);
        }
    }
}