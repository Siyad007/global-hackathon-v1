package com.example.memory_keeper.service.impl;
// src/main/java/com/example/memory_keeper/service/impl/AnalyticsServiceImpl.java
package com.example.memory_keeper.service.impl;

import com.example.memory_keeper.dto.response.AnalyticsResponse;
import com.example.memory_keeper.model.entity.Story;
import com.example.memory_keeper.repository.StoryRepository;
import com.example.memory_keeper.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final StoryRepository storyRepository;

    @Override
    public AnalyticsResponse getUserAnalytics(Long userId) {

        Page<Story> storiesPage = storyRepository.findByUserId(userId, Pageable.unpaged());
        List<Story> stories = storiesPage.getContent();

        long totalStories = stories.size();
        long totalHearts = stories.stream()
                .mapToLong(s -> s.getReactionCount("HEART"))
                .sum();

        long totalViews = stories.stream()
                .mapToLong(s -> s.getViewsCount() != null ? s.getViewsCount() : 0)
                .sum();

        int averageWordCount = stories.isEmpty() ? 0 :
                (int) stories.stream()
                        .mapToInt(s -> s.getWordCount() != null ? s.getWordCount() : 0)
                        .average()
                        .orElse(0);

        Map<String, Long> categoryCounts = stories.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getCategory() != null ? s.getCategory().toString() : "GENERAL",
                        Collectors.counting()
                ));

        Map<String, Long> sentimentCounts = stories.stream()
                .filter(s -> s.getSentimentLabel() != null)
                .collect(Collectors.groupingBy(
                        Story::getSentimentLabel,
                        Collectors.counting()
                ));

        Map<String, Long> tagCounts = new HashMap<>();
        stories.forEach(story -> {
            story.getTags().forEach(tag -> {
                tagCounts.put(tag.getName(), tagCounts.getOrDefault(tag.getName(), 0L) + 1);
            });
        });

        Map<String, Long> emotionCounts = new HashMap<>();
        stories.forEach(story -> {
            story.getEmotions().forEach(emotion -> {
                String emotionType = emotion.getEmotionType();
                emotionCounts.put(emotionType, emotionCounts.getOrDefault(emotionType, 0L) + 1);
            });
        });

        return AnalyticsResponse.builder()
                .totalStories(totalStories)
                .totalHearts(totalHearts)
                .totalViews(totalViews)
                .averageWordCount(averageWordCount)
                .categoryCounts(categoryCounts)
                .sentimentCounts(sentimentCounts)
                .tagCounts(tagCounts)
                .emotionCounts(emotionCounts)
                .build();
    }
}