package com.example.memory_keeper.dto.response;

import com.example.memory_keeper.model.enums.EmotionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private Long totalStories;
    private Long totalHearts;
    private Long totalViews;
    private Integer averageWordCount;

    private Map<String, Long> categoryCounts;
    private Map<String, Long> sentimentCounts;
    private Map<EmotionType, Long> emotionCounts;
    private Map<String, Long> tagCounts;
}