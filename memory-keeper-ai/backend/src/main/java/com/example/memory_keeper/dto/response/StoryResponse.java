package com.example.memory_keeper.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoryResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userAvatar;

    private String title;
    private String transcript;
    private String enhancedStory;
    private String summary;

    private String audioUrl;
    private String imageUrl;

    private String category;
    private String sentimentLabel;
    private Double sentimentScore;

    private Integer wordCount;
    private Integer viewsCount;
    private Boolean isPublic;

    private List<String> tags;
    private List<EmotionDTO> emotions;

    private ReactionCounts reactionCounts;
    private Integer commentsCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @AllArgsConstructor
    public static class EmotionDTO {
        private String label;
        private Double score;
    }

    @Data
    @AllArgsConstructor
    public static class ReactionCounts {
        private Integer hearts;
        private Integer smiles;
        private Integer cries;
    }
}