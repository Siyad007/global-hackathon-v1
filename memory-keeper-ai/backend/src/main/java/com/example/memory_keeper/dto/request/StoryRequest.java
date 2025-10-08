package com.example.memory_keeper.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class StoryRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Long familyId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Transcript is required")
    private String transcript;

    private String enhancedStory;
    private String summary;
    private String audioUrl;
    private String imageUrl;
    private String ttsAudioUrl;

    @NotBlank(message = "Category is required")
    private String category;

    private String sentimentLabel;
    private Double sentimentScore;
    private Integer wordCount;
    private Boolean isPublic;

    private List<String> tags;
    private List<Map<String, Object>> emotions;
}