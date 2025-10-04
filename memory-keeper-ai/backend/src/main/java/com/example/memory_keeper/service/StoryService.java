package com.example.memory_keeper.service;
// src/main/java/com/memorykeeper/service/StoryService.java
package com.memorykeeper.service;

import com.memorykeeper.dto.request.StoryRequest;
import com.memorykeeper.dto.response.StoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StoryService {
    StoryResponse createStory(StoryRequest request);
    StoryResponse getStoryById(Long id);
    Page<StoryResponse> getUserStories(Long userId, Pageable pageable);
    Page<StoryResponse> searchStories(String query, Pageable pageable);
    Page<StoryResponse> getStoriesByCategory(String category, Pageable pageable);
    StoryResponse addReaction(Long storyId, Long userId, String reactionType);
    StoryResponse addComment(Long storyId, Long userId, String content);
    void deleteStory(Long id);
}