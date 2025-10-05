// src/main/java/com/example/memory_keeper/ai/StabilityAIClient.java
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

@Component
@Slf4j
@RequiredArgsConstructor
public class StabilityAIClient {

    @Value("${ai.stabilityai.api-key}")
    private String apiKey;

    @Value("${ai.stabilityai.api-url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();

    public byte[] generateImage(String prompt) throws IOException {

        // --- START OF FINAL FIX for the "Core" API ---
        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("prompt", prompt)
                .addFormDataPart("output_format", "png")
                .addFormDataPart("aspect_ratio", "1:1"); // Correct parameter name

        RequestBody body = builder.build();
        // --- END OF FINAL FIX ---

        Request request = new Request.Builder()
                .url(apiUrl)
                .addHeader("Authorization", "Bearer " + apiKey)
                .addHeader("Accept", "application/json; charset=utf-8") // Use a more specific Accept header
                .post(body)
                .build();

        log.info("Calling Stability AI (Core) for image generation at URL: {}", apiUrl);

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "No response body";

            if (!response.isSuccessful()) {
                log.error("Stability AI API failed with status: {}. Body: {}", response.code(), responseBody);
                throw new IOException("Stability AI image generation failed: " + response.code());
            }

            JsonNode jsonResponse = objectMapper.readTree(responseBody);

            // The "Core" API returns the Base64 image directly in the `image` field.
            if (jsonResponse.has("image")) {
                String base64Image = jsonResponse.get("image").asText();
                return java.util.Base64.getDecoder().decode(base64Image);
            } else {
                log.error("Stability AI response did not contain image data. Body: {}", responseBody);
                throw new IOException("Could not parse image from Stability AI response.");
            }
        }
    }
}