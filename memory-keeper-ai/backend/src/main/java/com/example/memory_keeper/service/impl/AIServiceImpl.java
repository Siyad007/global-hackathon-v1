package com.example.memory_keeper.service.impl;



import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.memory_keeper.ai.GroqClient;
import com.example.memory_keeper.ai.HuggingFaceClient;
import com.example.memory_keeper.ai.ReplicateClient;
import com.example.memory_keeper.dto.response.AIResponse;
import com.example.memory_keeper.service.AIService;
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
 * Advanced AI Service
 *
 * Orchestrates multiple AI providers for comprehensive story enhancement
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final GroqClient groqClient;
    private final HuggingFaceClient huggingFaceClient;
    private final ReplicateClient replicateClient;
    private final ObjectMapper objectMapper;

    /**
     * MAIN METHOD: Complete Story Enhancement
     *
     * Process:
     * 1. Generate follow-up questions (Groq)
     * 2. Enhance story (Groq)
     * 3. Create title (Groq)
     * 4. Extract metadata (Groq)
     * 5. Analyze sentiment (Hugging Face)
     * 6. Detect emotions (Hugging Face)
     * 7. Generate image (Replicate) - Async
     */
    @Override
    public AIResponse enhanceStory(String transcript, String additionalAnswers) {

        String fullTranscript = transcript;
        if (additionalAnswers != null && !additionalAnswers.isEmpty()) {
            fullTranscript += "\n\n" + additionalAnswers;
        }

        AIResponse response = new AIResponse();

        try {
            // 1. Generate Follow-up Questions
            log.info("Generating follow-up questions...");
            String questions = groqClient.chat(
                    "You are a compassionate interviewer helping preserve family memories. " +
                            "Generate 3 thoughtful, specific follow-up questions to enrich this story. " +
                            "Make questions personal and detailed.",
                    "Story: " + fullTranscript + "\n\nGenerate 3 questions:"
            );
            response.setQuestions(parseQuestions(questions));

            // 2. Enhance Story
            log.info("Enhancing story...");
            String enhancedStory = groqClient.chat(
                    "You are an expert storyteller. Transform this raw memory into a beautiful, " +
                            "emotional story (400-500 words). Preserve the authentic voice and emotions. " +
                            "Add sensory details (sights, sounds, smells). Create narrative flow. " +
                            "Make it touching and memorable. Use vivid language.",
                    fullTranscript,
                    0.8,
                    1000
            );
            response.setEnhancedStory(enhancedStory);

            // 3. Generate Title
            log.info("Generating title...");
            String title = groqClient.chat(
                    "Create a short, emotional, memorable title (5-8 words) for this story. " +
                            "Make it poetic and evocative.",
                    "Story: " + fullTranscript,
                    0.7,
                    30
            );
            response.setTitle(cleanTitle(title));

            // 4. Extract Metadata
            log.info("Extracting metadata...");
            String metadataPrompt = "Analyze this story and extract:\n" +
                    "1. 3-5 specific tags (topics, time periods, places, people)\n" +
                    "2. Primary category: CHILDHOOD, CAREER, LOVE, FAMILY, TRAVEL, WAR, ACHIEVEMENT, WISDOM, or GENERAL\n" +
                    "3. Brief 2-sentence summary\n\n" +
                    "Story: " + fullTranscript + "\n\n" +
                    "Return ONLY valid JSON in this exact format:\n" +
                    "{\"tags\": [\"tag1\", \"tag2\"], \"category\": \"CATEGORY\", \"summary\": \"summary text\"}";

            String metadataJson = groqClient.chat(
                    "You are a precise data extractor. Return only valid JSON, nothing else.",
                    metadataPrompt,
                    0.3,
                    300
            );

            Map<String, Object> metadata = parseMetadata(metadataJson);
            response.setTags((List<String>) metadata.get("tags"));
            response.setCategory((String) metadata.get("category"));
            response.setSummary((String) metadata.get("summary"));

            // 5. Analyze Sentiment
            log.info("Analyzing sentiment...");
            Map<String, Object> sentiment = huggingFaceClient.analyzeSentiment(fullTranscript);
            response.setSentimentLabel((String) sentiment.get("label"));
            response.setSentimentScore((Double) sentiment.get("score"));

            // 6. Detect Emotions
            log.info("Detecting emotions...");
            JsonNode emotionsArray = huggingFaceClient.detectEmotions(fullTranscript);
            List<Map<String, Object>> emotions = parseEmotions(emotionsArray);
            response.setEmotions(emotions);

            // 7. Generate Image (Async - don't wait)
            CompletableFuture.runAsync(() -> {
                try {
                    String imagePrompt = createImagePrompt(enhancedStory, response.getTitle());
                    String imageUrl = replicateClient.generateImage(imagePrompt);
                    response.setImageUrl(imageUrl);
                    log.info("Image generated: {}", imageUrl);
                } catch (Exception e) {
                    log.warn("Image generation failed (non-critical): {}", e.getMessage());
                }
            });

            // Calculate word count
            response.setWordCount(fullTranscript.split("\\s+").length);

            log.info("Story enhancement complete!");
            return response;

        } catch (Exception e) {
            log.error("Story enhancement failed", e);
            throw new RuntimeException("AI enhancement failed: " + e.getMessage());
        }
    }

    /**
     * AI Chatbot - Talk to Grandparent
     */
    @Override
    public String chatWithGrandparent(List<String> stories, String question, String grandparentName) {

        String storiesContext = String.join("\n\n---\n\n", stories);

        String systemPrompt = String.format(
                "You are %s, a warm, loving grandparent with a rich life history. " +
                        "Answer questions based ONLY on the life stories provided below. " +
                        "Speak in first person, warmly and conversationally, as if talking to a beloved grandchild. " +
                        "If the answer isn't in your stories, say: 'I don't recall sharing that memory yet, dear. Would you like to hear about something else?'\n\n" +
                        "YOUR LIFE STORIES:\n%s",
                grandparentName,
                storiesContext
        );

        try {
            return groqClient.chat(systemPrompt, question, 0.9, 400);
        } catch (Exception e) {
            log.error("Chat failed", e);
            return "I'm having trouble remembering right now, dear. Please try asking again.";
        }
    }

    /**
     * Generate daily memory prompt
     */
    @Override
    @Cacheable("daily-prompts")
    public String generateDailyPrompt(String category) {

        String systemPrompt = "You are a thoughtful interviewer creating memory prompts for elderly people. " +
                "Create ONE specific, detailed question that will help them share a rich memory. " +
                "Make it warm, personal, and detailed. Focus on sensory details and emotions.";

        String userPrompt = "Generate a memory prompt about: " + category;

        try {
            return groqClient.chat(systemPrompt, userPrompt, 0.8, 100);
        } catch (Exception e) {
            return "What's a happy memory that always makes you smile?";
        }
    }

    /**
     * Async Image Generation
     */
    @Async
    @Override
    public CompletableFuture<String> generateStoryImage(String story, String title) {
        try {
            String prompt = createImagePrompt(story, title);
            String imageUrl = replicateClient.generateImage(prompt);
            return CompletableFuture.completedFuture(imageUrl);
        } catch (Exception e) {
            log.error("Image generation failed", e);
            return CompletableFuture.completedFuture(null);
        }
    }

    // ==================== HELPER METHODS ====================

    private List<String> parseQuestions(String questionsText) {
        return Arrays.stream(questionsText.split("\n"))
                .map(String::trim)
                .filter(q -> !q.isEmpty() && (q.matches("^\\d+\\..+") || q.endsWith("?")))
                .map(q -> q.replaceFirst("^\\d+\\.\\s*", ""))
                .limit(3)
                .collect(Collectors.toList());
    }

    private String cleanTitle(String title) {
        return title.replace("\"", "")
                .replace("Title:", "")
                .trim();
    }

    private Map<String, Object> parseMetadata(String metadataJson) {
        try {
            // Extract JSON from response (in case there's extra text)
            String json = metadataJson;
            int start = metadataJson.indexOf("{");
            int end = metadataJson.lastIndexOf("}") + 1;
            if (start >= 0 && end > start) {
                json = metadataJson.substring(start, end);
            }

            JsonNode node = objectMapper.readTree(json);
            Map<String, Object> result = new HashMap<>();

            // Parse tags
            List<String> tags = new ArrayList<>();
            JsonNode tagsNode = node.get("tags");
            if (tagsNode != null && tagsNode.isArray()) {
                tagsNode.forEach(tag -> tags.add(tag.asText()));
            }
            result.put("tags", tags.isEmpty() ? List.of("memory") : tags);

            // Parse category
            String category = node.has("category") ?
                    node.get("category").asText().toUpperCase() : "GENERAL";
            result.put("category", category);

            // Parse summary
            String summary = node.has("summary") ?
                    node.get("summary").asText() : "";
            result.put("summary", summary);

            return result;

        } catch (Exception e) {
            log.warn("Metadata parsing failed, using defaults", e);
            return Map.of(
                    "tags", List.of("memory"),
                    "category", "GENERAL",
                    "summary", ""
            );
        }
    }

    private List<Map<String, Object>> parseEmotions(JsonNode emotionsArray) {
        List<Map<String, Object>> emotions = new ArrayList<>();

        if (emotionsArray != null && emotionsArray.isArray()) {
            emotionsArray.forEach(emotion -> {
                Map<String, Object> emotionMap = new HashMap<>();
                emotionMap.put("label", emotion.get("label").asText());
                emotionMap.put("score", emotion.get("score").asDouble());
                emotions.add(emotionMap);
            });
        }

        // Sort by score descending, take top 3
        return emotions.stream()
                .sorted((a, b) -> Double.compare(
                        (Double) b.get("score"),
                        (Double) a.get("score")
                ))
                .limit(3)
                .collect(Collectors.toList());
    }

    private String createImagePrompt(String story, String title) {
        // Create detailed image generation prompt from story
        String basePrompt = "Create a warm, nostalgic, vintage-style illustration for this memory: " + title;

        // Extract visual details from story (first 200 chars)
        String visualContext = story.length() > 200 ?
                story.substring(0, 200) + "..." : story;

        return basePrompt + ". " + visualContext +
                ". Style: warm colors, soft lighting, emotional, heartwarming, vintage photography aesthetic.";
    }
}