// src/main/java/com/example/memory_keeper/service/impl/AIServiceImpl.java
package com.example.memory_keeper.service.impl;

import com.example.memory_keeper.ai.TTSClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.memory_keeper.ai.GroqClient;
import com.example.memory_keeper.ai.HuggingFaceClient;
import com.example.memory_keeper.ai.StabilityAIClient; // Import the new, correct client
import com.example.memory_keeper.dto.response.AIResponse;
import com.example.memory_keeper.service.AIService;
import com.example.memory_keeper.service.CloudinaryService;
import com.example.memory_keeper.util.ByteArrayMultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * Advanced AI Service (FINAL, STABILITY.AI VERSION)
 *
 * Orchestrates multiple free AI providers for comprehensive story enhancement.
 * - Groq: For all text generation (story, title, questions, metadata).
 * - Hugging Face: For sentiment analysis and emotion detection.
 * - Stability AI: For reliable, free-tier image generation.
 * - Cloudinary: For storing the AI-generated image.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final GroqClient groqClient;
    private final HuggingFaceClient huggingFaceClient;
    private final StabilityAIClient stabilityAIClient; // Inject the new Stability AI client
    private final CloudinaryService cloudinaryService;
    private final TTSClient ttsClient;
    private final ObjectMapper objectMapper;

    /**
     * MAIN METHOD: Complete Story Enhancement
     * This is the master method that coordinates all AI calls.
     */
    @Override
    public AIResponse enhanceStory(String transcript, String additionalAnswers) {

        String fullTranscript = transcript;
        if (additionalAnswers != null && !additionalAnswers.isEmpty()) {
            fullTranscript += "\n\n" + additionalAnswers;
        }

        AIResponse response = new AIResponse();

        try {
            // Step 1: Generate Follow-up Questions (Groq)
            log.info("Step 1/7: Calling Groq for follow-up questions...");
            String questions = groqClient.chat(
                    "You are a compassionate interviewer helping preserve family memories...",
                    "Story: " + fullTranscript + "\n\nGenerate 3 questions:"
            );
            response.setQuestions(parseQuestions(questions));
            log.info("✅ Step 1 complete.");

            // Step 2: Enhance Story (Groq)
            log.info("Step 2/7: Calling Groq to enhance story...");
            String enhancedStory = groqClient.chat(
                    "You are an expert storyteller... Transform this raw memory...",
                    fullTranscript, 0.8, 1000
            );
            response.setEnhancedStory(enhancedStory);
            log.info("✅ Step 2 complete.");

            // Step 3: Generate Title (Groq)
            log.info("Step 3/7: Calling Groq to generate title...");
            String title = groqClient.chat(
                    "Create a short, emotional, memorable title...",
                    "Story: " + fullTranscript, 0.7, 30
            );
            response.setTitle(cleanTitle(title));
            log.info("✅ Step 3 complete.");

            // Step 4: Extract Metadata (Groq)
            log.info("Step 4/7: Calling Groq to extract metadata...");
            String metadataPrompt = "Analyze this story and extract... Return ONLY valid JSON...";
            String metadataJson = groqClient.chat(
                    "You are a precise data extractor...",
                    metadataPrompt, 0.3, 300
            );
            Map<String, Object> metadata = parseMetadata(metadataJson);
            response.setTags((List<String>) metadata.get("tags"));
            response.setCategory((String) metadata.get("category"));
            response.setSummary((String) metadata.get("summary"));
            log.info("✅ Step 4 complete.");

            // Step 5: Analyze Sentiment (Hugging Face)
            log.info("Step 5/7: Calling Hugging Face for sentiment analysis...");
            try {
                Map<String, Object> sentiment = huggingFaceClient.analyzeSentiment(fullTranscript);
                if (sentiment != null) {
                    response.setSentimentLabel((String) sentiment.get("label"));
                    response.setSentimentScore((Double) sentiment.get("score"));
                    log.info("✅ Step 5 complete. Sentiment: {}", sentiment);
                }
            } catch (Exception e) {
                log.warn("⚠️ Step 5 (Sentiment Analysis) failed, continuing without it. Error: {}", e.getMessage());
            }

            // Step 6: Detect Emotions (Hugging Face)
            log.info("Step 6/7: Calling Hugging Face to detect emotions...");
            try {
                JsonNode emotionsArray = huggingFaceClient.detectEmotions(fullTranscript);
                if (emotionsArray != null) {
                    List<Map<String, Object>> emotions = parseEmotions(emotionsArray);
                    response.setEmotions(emotions);
                    log.info("✅ Step 6 complete. Emotions detected: {}", emotions.size());
                }
            } catch (Exception e) {
                log.warn("⚠️ Step 6 (Emotion Detection) failed, continuing without it. Error: {}", e.getMessage());
            }

            // Step 7: Generate Image using Stability AI (Asynchronously)
            log.info("Step 7/7: Starting Stability AI image generation (async)...");
            generateStoryImage(response.getEnhancedStory(), response.getTitle())
                    .thenAccept(response::setImageUrl)
                    .exceptionally(ex -> {
                        log.warn("🖼️ Async Image generation failed (non-critical): {}", ex.getMessage());
                        return null;
                    });

            response.setWordCount(fullTranscript.split("\\s+").length);
            log.info("🎉 Story enhancement complete! (Image is generating in the background)");
            if (response.getEnhancedStory() != null && !response.getEnhancedStory().isEmpty()) {
                try {
                    log.info("🎙️ Generating TTS audio...");
                    byte[] audioBytes = ttsClient.textToSpeech(response.getEnhancedStory());

                    // Upload to Cloudinary
                    ByteArrayMultipartFile audioFile = new ByteArrayMultipartFile(
                            audioBytes,
                            "tts-audio",
                            "tts-audio.mp3",
                            "audio/mpeg"
                    );

                    String ttsUrl = cloudinaryService.uploadAudio(audioFile);
                    response.setTtsAudioUrl(ttsUrl);  // Add this field to AIResponse

                    log.info("✅ TTS audio generated: {}", ttsUrl);
                } catch (Exception e) {
                    log.warn("⚠️ TTS generation failed (non-critical): {}", e.getMessage());
                }
            }

            return response;

        } catch (Exception e) {
            log.error("❌ CRITICAL ERROR during AI enhancement process (likely a Groq call failed)", e);
            throw new RuntimeException("AI enhancement failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String chatWithGrandparent(List<String> stories, String question, String grandparentName) {
        String storiesContext = String.join("\n\n---\n\n", stories);
        String systemPrompt = String.format("You are %s...", grandparentName, storiesContext);
        try {
            return groqClient.chat(systemPrompt, question, 0.9, 400);
        } catch (Exception e) {
            log.error("Chat failed", e);
            return "I'm having trouble remembering right now, dear.";
        }
    }

    @Override
    @Cacheable("daily-prompts")
    public String generateDailyPrompt(String category) {
        String systemPrompt = "You are a thoughtful interviewer...";
        String userPrompt = "Generate a memory prompt about: " + category;
        try {
            return groqClient.chat(systemPrompt, userPrompt, 0.8, 100);
        } catch (Exception e) {
            return "What's a happy memory that always makes you smile?";
        }
    }

    /**
     * Async Image Generation (FINAL, STABILITY.AI VERSION)
     * This method now uses the reliable Stability AI API.
     */
    @Async
    @Override
    public CompletableFuture<String> generateStoryImage(String story, String title) {
        try {
            String prompt = createImagePrompt(story, title);
            log.info("Calling Stability AI with image prompt: {}", prompt);

            // 1. Call Stability AI to get the raw image bytes (PNG data)
            byte[] imageBytes = stabilityAIClient.generateImage(prompt);

            if (imageBytes == null || imageBytes.length == 0) {
                throw new IOException("Stability AI returned an empty image.");
            }

            // 2. Wrap the bytes in our custom MultipartFile implementation
            ByteArrayMultipartFile multipartFile = new ByteArrayMultipartFile(
                    imageBytes, "file", "story-image.png", "image/png"
            );

            // 3. Upload to Cloudinary to get a permanent URL
            log.info("Uploading AI-generated image ({} bytes) to Cloudinary...", imageBytes.length);
            String imageUrl = cloudinaryService.uploadImage(multipartFile);

            log.info("🖼️ Image successfully generated and uploaded to: {}", imageUrl);
            return CompletableFuture.completedFuture(imageUrl);

        } catch (Exception e) {
            log.error("Image generation and upload failed in async method", e);
            return CompletableFuture.failedFuture(e);
        }
    }

    // ==================== HELPER METHODS ====================

    private List<String> parseQuestions(String questionsText) {
        if (questionsText == null || questionsText.isEmpty()) return Collections.emptyList();
        return Arrays.stream(questionsText.split("\n"))
                .map(String::trim)
                .filter(q -> !q.isEmpty() && (q.matches("^\\d+\\..+") || q.endsWith("?")))
                .map(q -> q.replaceFirst("^\\d+\\.\\s*", ""))
                .limit(3)
                .collect(Collectors.toList());
    }

    private String cleanTitle(String title) {
        if (title == null) return "Untitled Story";
        return title.replace("\"", "").replace("Title:", "").trim();
    }

    private Map<String, Object> parseMetadata(String metadataJson) {
        if (metadataJson == null || metadataJson.isEmpty()) {
            log.warn("Metadata JSON was empty, using defaults.");
            return Map.of("tags", List.of("memory"), "category", "GENERAL", "summary", "");
        }
        try {
            String json = metadataJson;
            int start = metadataJson.indexOf("{");
            int end = metadataJson.lastIndexOf("}") + 1;
            if (start >= 0 && end > start) {
                json = metadataJson.substring(start, end);
            }
            JsonNode node = objectMapper.readTree(json);
            Map<String, Object> result = new HashMap<>();

            List<String> tags = new ArrayList<>();
            if (node.has("tags") && node.get("tags").isArray()) {
                node.get("tags").forEach(tag -> tags.add(tag.asText()));
            }
            result.put("tags", tags.isEmpty() ? List.of("memory") : tags);

            String category = node.has("category") ? node.get("category").asText().toUpperCase() : "GENERAL";
            result.put("category", category);

            String summary = node.has("summary") ? node.get("summary").asText() : "";
            result.put("summary", summary);

            return result;
        } catch (Exception e) {
            log.warn("Metadata parsing failed, using defaults. JSON was: {}", metadataJson, e);
            return Map.of("tags", List.of("memory"), "category", "GENERAL", "summary", "");
        }
    }

    private List<Map<String, Object>> parseEmotions(JsonNode emotionsArray) {
        List<Map<String, Object>> emotions = new ArrayList<>();
        if (emotionsArray == null || !emotionsArray.isArray()) return emotions;

        emotionsArray.forEach(emotion -> {
            if (emotion.has("label") && emotion.has("score")) {
                Map<String, Object> emotionMap = new HashMap<>();
                emotionMap.put("label", emotion.get("label").asText());
                emotionMap.put("score", emotion.get("score").asDouble());
                emotions.add(emotionMap);
            }
        });

        return emotions.stream()
                .sorted(Comparator.comparingDouble(m -> (Double) ((Map<String, Object>) m).get("score")).reversed())
                .limit(3)
                .collect(Collectors.toList());
    }

    private String createImagePrompt(String story, String title) {
        String basePrompt = "Create a warm, nostalgic, vintage-style illustration for this memory: " + title;
        String visualContext = (story != null && story.length() > 200) ? story.substring(0, 200) + "..." : story;
        return basePrompt + ". " + visualContext + ". Style: warm colors, soft lighting, emotional, heartwarming, vintage photography aesthetic, detailed, high quality.";
    }
}