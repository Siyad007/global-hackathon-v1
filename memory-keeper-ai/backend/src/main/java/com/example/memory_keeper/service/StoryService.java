package com.example.memory_keeper.service;
// src/main/java/com/example/memory_keeper/service/StoryService.java
package com.example.memory_keeper.service;

import com.example.memory_keeper.dto.request.StoryRequest;
import com.example.memory_keeper.dto.response.StoryResponse;
import com.example.memory_keeper.model.enums.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoryService {
    StoryResponse createStory(StoryRequest request);
    StoryResponse getStoryById(Long id);
    Page<StoryResponse> getUserStories(Long userId, Pageable pageable);
    Page<StoryResponse> searchStories(String query, Pageable pageable);
    Page<StoryResponse> getStoriesByCategory(String category, Pageable pageable);
    StoryResponse addReaction(Long storyId, Long userId, ReactionType reactionType);
    StoryResponse addComment(Long storyId, Long userId, String content);
    void deleteStory(Long id);
}