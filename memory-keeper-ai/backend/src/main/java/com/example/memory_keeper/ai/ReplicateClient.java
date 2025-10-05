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
 * Replicate Client - Image Generation
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

    // Create client with proper timeouts
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    /**
     * Generate image from prompt using Stable Diffusion XL
     */
    public String generateImage(String prompt) throws IOException, InterruptedException {
        log.info("Starting image generation with prompt: {}", prompt);

        // Prepare request body with correct SDXL version
        Map<String, Object> input = Map.of(
                "prompt", prompt,
                "width", 1024,
                "height", 1024,
                "num_outputs", 1,
                "guidance_scale", 7.5,
                "num_inference_steps", 30
        );

        // Use the correct stable diffusion model version
        Map<String, Object> requestBody = Map.of(
                "version", "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL 1.0
                "input", input
        );

        String jsonBody = objectMapper.writeValueAsString(requestBody);
        log.debug("Request body: {}", jsonBody);

        RequestBody body = RequestBody.create(
                jsonBody,
                MediaType.parse("application/json; charset=utf-8")
        );

        Request request = new Request.Builder()
                .url(apiUrl + "/predictions")
                .addHeader("Authorization", "Token " + apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        // Start the prediction
        String predictionId;
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No response body";
                log.error("Replicate API error: {} - {}", response.code(), errorBody);
                throw new IOException("Image generation request failed: " + response.code() + " - " + errorBody);
            }

            String responseBody = response.body().string();
            log.debug("Prediction started: {}", responseBody);

            JsonNode json = objectMapper.readTree(responseBody);

            if (!json.has("id")) {
                log.error("No prediction ID in response: {}", responseBody);
                throw new IOException("Invalid response from Replicate API");
            }

            predictionId = json.get("id").asText();
            log.info("Prediction ID: {}", predictionId);
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

        // Poll for up to 60 seconds (image generation can take time)
        int maxAttempts = 60;
        for (int i = 0; i < maxAttempts; i++) {
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "No response body";
                    log.error("Poll request failed: {} - {}", response.code(), errorBody);
                    throw new IOException("Failed to poll prediction: " + response.code());
                }

                String responseBody = response.body().string();
                JsonNode json = objectMapper.readTree(responseBody);

                String status = json.get("status").asText();
                log.debug("Poll attempt {}: status = {}", i + 1, status);

                if ("succeeded".equals(status)) {
                    JsonNode output = json.get("output");

                    if (output == null) {
                        log.error("No output in successful response");
                        throw new IOException("Image generation succeeded but no output returned");
                    }

                    // Output can be array or single string
                    if (output.isArray() && output.size() > 0) {
                        String imageUrl = output.get(0).asText();
                        log.info("Image generated successfully: {}", imageUrl);
                        return imageUrl;
                    } else if (output.isTextual()) {
                        String imageUrl = output.asText();
                        log.info("Image generated successfully: {}", imageUrl);
                        return imageUrl;
                    } else {
                        log.error("Unexpected output format: {}", output);
                        throw new IOException("Unexpected output format");
                    }

                } else if ("failed".equals(status)) {
                    String error = json.has("error") ? json.get("error").asText() : "Unknown error";
                    log.error("Image generation failed: {}", error);
                    throw new IOException("Image generation failed: " + error);

                } else if ("canceled".equals(status)) {
                    log.error("Image generation was canceled");
                    throw new IOException("Image generation was canceled");
                }

                // Status is "starting" or "processing", wait before next poll
                TimeUnit.SECONDS.sleep(1);
            }
        }

        log.error("Image generation timeout after {} seconds", maxAttempts);
        throw new IOException("Image generation timeout after " + maxAttempts + " seconds");
    }
}