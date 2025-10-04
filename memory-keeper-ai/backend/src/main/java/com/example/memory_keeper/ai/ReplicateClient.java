package com.example.memory_keeper.ai;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * Replicate Client - FREE Image Generation
 *
 * What: Generates images from text descriptions
 * Why: FREE $0.50 credit (100+ images)
 * When: Create visual representation of stories
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ReplicateClient {

    @Value("${ai.replicate.api-key}")
    private String apiKey;

    @Value("${ai.replicate.api-url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient();

    /**
     * Generate image from prompt
     * Uses: Stable Diffusion XL
     */
    public String generateImage(String prompt) throws IOException, InterruptedException {

        // Start prediction
        String predictionUrl = apiUrl + "/predictions";

        Map<String, Object> input = Map.of(
                "prompt", prompt,
                "width", 1024,
                "height", 1024,
                "num_outputs", 1,
                "guidance_scale", 7.5
        );

        Map<String, Object> requestBody = Map.of(
                "version", "stability-ai/sdxl:latest",
                "input", input
        );

        RequestBody body = RequestBody.create(
                objectMapper.writeValueAsString(requestBody),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(predictionUrl)
                .addHeader("Authorization", "Token " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        String predictionId;
        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            predictionId = json.get("id").asText();
        }

        // Poll for result
        return pollPrediction(predictionId);
    }

    private String pollPrediction(String predictionId) throws IOException, InterruptedException {
        String getUrl = apiUrl + "/predictions/" + predictionId;

        Request request = new Request.Builder()
                .url(getUrl)
                .addHeader("Authorization", "Token " + apiKey)
                .get()
                .build();

        // Poll up to 30 seconds
        for (int i = 0; i < 30; i++) {
            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                JsonNode json = objectMapper.readTree(responseBody);

                String status = json.get("status").asText();

                if ("succeeded".equals(status)) {
                    return json.get("output").get(0).asText();
                } else if ("failed".equals(status)) {
                    throw new IOException("Image generation failed");
                }

                // Wait 1 second before next poll
                TimeUnit.SECONDS.sleep(1);
            }
        }

        throw new IOException("Image generation timeout");
    }
}