package com.example.memory_keeper.ai;
// src/main/java/com/example/memory_keeper/ai/ElevenLabsClient.java
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ElevenLabs Client - Voice Cloning & TTS
 * FREE TIER: 10,000 characters/month
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class ElevenLabsClient {

    @Value("${ai.elevenlabs.api-key}")
    private String apiKey;

    @Value("${ai.elevenlabs.api-url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final OkHttpClient client = new OkHttpClient();

    /**
     * TEXT-TO-SPEECH
     */
    public byte[] textToSpeech(String text, String voiceId) throws IOException {

        if (text.length() > 1000) {
            log.warn("Text too long ({}), truncating to 1000 chars", text.length());
            text = text.substring(0, 1000);
        }

        String url = apiUrl + "/text-to-speech/" + voiceId;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("text", text);
        requestBody.put("model_id", "eleven_monolingual_v1");

        Map<String, Object> voiceSettings = new HashMap<>();
        voiceSettings.put("stability", 0.5);
        voiceSettings.put("similarity_boost", 0.75);
        requestBody.put("voice_settings", voiceSettings);

        RequestBody body = RequestBody.create(
                objectMapper.writeValueAsString(requestBody),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(url)
                .addHeader("xi-api-key", apiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("TTS failed: " + response.code());
            }

            byte[] audioBytes = response.body().bytes();
            log.info("Generated audio: {} bytes", audioBytes.length);
            return audioBytes;
        }
    }

    /**
     * VOICE CLONING
     */
    public String cloneVoice(String name, String description, List<MultipartFile> audioFiles)
            throws IOException {

        String url = apiUrl + "/voices/add";

        MultipartBody.Builder builder = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("name", name)
                .addFormDataPart("description", description);

        for (int i = 0; i < audioFiles.size(); i++) {
            MultipartFile file = audioFiles.get(i);
            builder.addFormDataPart(
                    "files",
                    file.getOriginalFilename(),
                    RequestBody.create(
                            file.getBytes(),
                            MediaType.parse("audio/mpeg")
                    )
            );
        }

        RequestBody body = builder.build();

        Request request = new Request.Builder()
                .url(url)
                .addHeader("xi-api-key", apiKey)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Voice cloning failed: " + response.code());
            }

            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);
            String voiceId = json.get("voice_id").asText();

            log.info("Voice cloned successfully: {} (ID: {})", name, voiceId);
            return voiceId;
        }
    }

    /**
     * GET ALL VOICES
     */
    public List<Map<String, String>> getVoices() throws IOException {

        String url = apiUrl + "/voices";

        Request request = new Request.Builder()
                .url(url)
                .addHeader("xi-api-key", apiKey)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);

            List<Map<String, String>> voices = new ArrayList<>();
            JsonNode voicesArray = json.get("voices");

            if (voicesArray != null && voicesArray.isArray()) {
                voicesArray.forEach(voice -> {
                    Map<String, String> voiceData = new HashMap<>();
                    voiceData.put("voice_id", voice.get("voice_id").asText());
                    voiceData.put("name", voice.get("name").asText());
                    voiceData.put("category", voice.has("category") ?
                            voice.get("category").asText() : "cloned");
                    voices.add(voiceData);
                });
            }

            return voices;
        }
    }

    /**
     * DELETE VOICE
     */
    public void deleteVoice(String voiceId) throws IOException {

        String url = apiUrl + "/voices/" + voiceId;

        Request request = new Request.Builder()
                .url(url)
                .addHeader("xi-api-key", apiKey)
                .delete()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Voice deletion failed: " + response.code());
            }

            log.info("Voice deleted: {}", voiceId);
        }
    }

    /**
     * GET USAGE STATS
     */
    public Map<String, Object> getUsageStats() throws IOException {

        String url = apiUrl + "/user/subscription";

        Request request = new Request.Builder()
                .url(url)
                .addHeader("xi-api-key", apiKey)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JsonNode json = objectMapper.readTree(responseBody);

            Map<String, Object> stats = new HashMap<>();
            stats.put("character_count", json.get("character_count").asInt());
            stats.put("character_limit", json.get("character_limit").asInt());
            stats.put("voice_limit", json.get("voice_limit").asInt());
            stats.put("can_use_instant_voice_cloning",
                    json.get("can_use_instant_voice_cloning").asBoolean());

            log.info("Usage: {}/{} characters",
                    stats.get("character_count"),
                    stats.get("character_limit"));

            return stats;
        }
    }
}