package com.example.memory_keeper.dto.response;
// src/main/java/com/memorykeeper/dto/response/AIResponse.java
package com.memorykeeper.dto.response;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AIResponse {
    private String enhancedStory;
    private String title;
    private String summary;
    private List<String> questions;
    private List<String> tags;
    private String category;
    private String sentimentLabel;
    private Double sentimentScore;
    private List<Map<String, Object>> emotions;
    private String imageUrl;
    private Integer wordCount;
}