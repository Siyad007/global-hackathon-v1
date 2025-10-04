package com.example.memory_keeper.service;
// src/main/java/com/memorykeeper/service/AIService.java
package com.memorykeeper.service;

import com.memorykeeper.dto.response.AIResponse;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface AIService {
    AIResponse enhanceStory(String transcript, String additionalAnswers);
    String chatWithGrandparent(List<String> stories, String question, String grandparentName);
    String generateDailyPrompt(String category);
    CompletableFuture<String> generateStoryImage(String story, String title);
}