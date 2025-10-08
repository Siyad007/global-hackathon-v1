package com.example.memory_keeper.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Simple, Free, No-Signup TTS Client
 * Uses the StreamElements public API.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class TTSClient {

    private final OkHttpClient client = new OkHttpClient();

    public byte[] textToSpeech(String text) throws IOException {

        // No API key needed for this service!
        log.info("🎙️ Generating TTS audio with free public API...");

        if (text == null || text.isEmpty()) {
            log.warn("⚠️ Text is empty, skipping TTS generation");
            return new byte[0];
        }

        // The API has a character limit, so we truncate if needed
        if (text.length() > 1000) {
            log.warn("Text too long for free API, truncating to 1000 chars");
            text = text.substring(0, 990) + "...";
        }

        // Build the URL correctly. This is a simple GET request.
        String encodedText = URLEncoder.encode(text, StandardCharsets.UTF_8);
        String apiUrl = "https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=" + encodedText;

        log.info("Calling TTS API at URL: {}", apiUrl);

        Request request = new Request.Builder()
                .url(apiUrl)
                .get()
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String error = response.body() != null ? response.body().string() : "Unknown error";
                log.error("❌ Free TTS API request failed with code {}: {}", response.code(), error);
                throw new IOException("TTS API failed: " + response.code() + " - " + error);
            }

            byte[] audioBytes = response.body().bytes();
            log.info("✅ Free TTS generated {} bytes of audio", audioBytes.length);
            return audioBytes;

        } catch (IOException e) {
            log.error("❌ TTS generation failed with exception", e);
            throw e;
        }
    }
}