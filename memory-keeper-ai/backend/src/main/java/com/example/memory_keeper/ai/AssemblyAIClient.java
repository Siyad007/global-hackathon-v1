package com.example.memory_keeper.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * AssemblyAI Client - Speech to Text
 * FREE TIER: 5 hours/month
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class AssemblyAIClient {

    @Value("${ai.assemblyai.api-key}")
    private String apiKey;

    @Value("${ai.assemblyai.api-url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(300, TimeUnit.SECONDS)
            .build();

    /**
     * Transcribe audio file to text
     */
    public String transcribeAudio(MultipartFile audioFile) throws IOException, InterruptedException {

        // Step 1: Upload audio file
        String audioUrl = uploadAudio(audioFile);

        // Step 2: Submit for transcription
        String transcriptId = submitTranscription(audioUrl);

        // Step 3: Poll for result
        return pollTranscription(transcriptId);
    }

    /**
     * Upload audio to AssemblyAI
     */
    private String uploadAudio(MultipartFile file) throws IOException {

        String uploadUrl = apiUrl + "/upload";

        RequestBody body = RequestBody.create(
                file.getBytes(),
                MediaType.parse("application/octet-stream")
        );

        Request request = new Request.Builder()
                .url(uploadUrl)
                .addHeader("authorization", apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Upload failed: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            String audioUrl = json.get("upload_url").asText();

            log.info("Audio uploaded to AssemblyAI: {}", audioUrl);
            return audioUrl;
        }
    }

    /**
     * Submit audio for transcription
     */
    private String submitTranscription(String audioUrl) throws IOException {

        String transcriptUrl = apiUrl + "/transcript";

        String requestJson = objectMapper.writeValueAsString(
                new TranscriptionRequest(audioUrl)
        );

        RequestBody body = RequestBody.create(
                requestJson,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(transcriptUrl)
                .addHeader("authorization", apiKey)
                .addHeader("content-type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Transcription submission failed: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            String transcriptId = json.get("id").asText();

            log.info("Transcription submitted: {}", transcriptId);
            return transcriptId;
        }
    }

    /**
     * Poll for transcription result
     */
    private String pollTranscription(String transcriptId) throws IOException, InterruptedException {

        String pollUrl = apiUrl + "/transcript/" + transcriptId;

        Request request = new Request.Builder()
                .url(pollUrl)
                .addHeader("authorization", apiKey)
                .get()
                .build();

        // Poll for up to 5 minutes
        for (int i = 0; i < 60; i++) {
            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                JsonNode json = objectMapper.readTree(responseBody);

                String status = json.get("status").asText();

                if ("completed".equals(status)) {
                    String transcript = json.get("text").asText();
                    log.info("Transcription completed: {} characters", transcript.length());
                    return transcript;

                } else if ("error".equals(status)) {
                    String error = json.get("error").asText();
                    throw new IOException("Transcription failed: " + error);
                }

                // Still processing, wait 5 seconds
                TimeUnit.SECONDS.sleep(5);
            }
        }

        throw new IOException("Transcription timeout");
    }

    // Inner class for request
    private static class TranscriptionRequest {
        public String audio_url;

        public TranscriptionRequest(String audioUrl) {
            this.audio_url = audioUrl;
        }
    }
}