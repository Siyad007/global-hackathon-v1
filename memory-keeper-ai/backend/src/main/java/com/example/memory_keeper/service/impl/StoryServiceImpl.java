package com.example.memory_keeper.service.impl;

// src/main/java/com/memorykeeper/service/impl/StoryServiceImpl.java
package com.memorykeeper.service.impl;

import com.memorykeeper.dto.request.StoryRequest;
import com.memorykeeper.dto.response.StoryResponse;
import com.memorykeeper.exception.ResourceNotFoundException;
import com.memorykeeper.model.entity.*;
import com.memorykeeper.model.enums.StoryCategory;
import com.memorykeeper.repository.*;
import com.memorykeeper.service.StoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class StoryServiceImpl implements StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final EmotionRepository emotionRepository;

    @Override
    @CacheEvict(value = "user-stories", key = "#request.userId")
    public StoryResponse createStory(StoryRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create Story
        Story story = Story.builder()
                .user(user)
                .title(request.getTitle())
                .transcript(request.getTranscript())
                .enhancedStory(request.getEnhancedStory())
                .summary(request.getSummary())
                .audioUrl(request.getAudioUrl())
                .imageUrl(request.getImageUrl())
                .category(StoryCategory.valueOf(request.getCategory()))
                .sentimentLabel(request.getSentimentLabel())
                .sentimentScore(request.getSentimentScore() != null ?
                        BigDecimal.valueOf(request.getSentimentScore()) : null)
                .wordCount(request.getWordCount())
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
                .build();

        // Add Tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = request.getTags().stream()
                    .map(this::getOrCreateTag)
                    .collect(Collectors.toSet());
            story.setTags(tags);
        }

        // Add Emotions
        if (request.getEmotions() != null && !request.getEmotions().isEmpty()) {
            Set<Emotion> emotions = request.getEmotions().stream()
                    .map(emotionData -> Emotion.builder()
                            .story(story)
                            .emotionType(emotionData.get("label").toString())
                            .confidence(BigDecimal.valueOf(
                                    Double.parseDouble(emotionData.get("score").toString())))
                            .build())
                    .collect(Collectors.toSet());
            story.setEmotions(emotions);
        }

        // Save Story
        Story savedStory = storyRepository.save(story);

        // Update User Stats
        user.setTotalStories(user.getTotalStories() + 1);
        userRepository.save(user);

        log.info("Story created: {} by user: {}", savedStory.getId(), user.getId());

        return convertToResponse(savedStory);
    }

    @Override
    @Cacheable(value = "stories", key = "#id")
    public StoryResponse getStoryById(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found: " + id));

        // Increment views
        story.incrementViews();
        storyRepository.save(story);

        return convertToResponse(story);
    }

    @Override
    @Cacheable(value = "user-stories", key = "#userId + '-' + #pageable.pageNumber")
    public Page<StoryResponse> getUserStories(Long userId, Pageable pageable) {
        return storyRepository.findByUserId(userId, pageable)
                .map(this::convertToResponse);
    }

    @Override
    public Page<StoryResponse> searchStories(String query, Pageable pageable) {
        return storyRepository.searchStories(query, pageable)
                .map(this::convertToResponse);
    }

    @Override
    public Page<StoryResponse> getStoriesByCategory(String category, Pageable pageable) {
        StoryCategory storyCategory = StoryCategory.valueOf(category.toUpperCase());
        return storyRepository.findByCategory(storyCategory, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @CacheEvict(value = "stories", key = "#storyId")
    public StoryResponse addReaction(Long storyId, Long userId, String reactionType) {

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if reaction already exists
        boolean exists = reactionRepository.existsByStoryIdAndUserIdAndReactionType(
                storyId, userId, reactionType);

        if (!exists) {
            Reaction reaction = Reaction.builder()
                    .story(story)
                    .user(user)
                    .reactionType(reactionType)
                    .build();

            reactionRepository.save(reaction);
        }

        return convertToResponse(story);
    }

    @Override
    @CacheEvict(value = "stories", key = "#storyId")
    public StoryResponse addComment(Long storyId, Long userId, String content) {

        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = Comment.builder()
                .story(story)
                .user(user)
                .content(content)
                .build();

        commentRepository.save(comment);

        return convertToResponse(story);
    }

    @Override
    @CacheEvict(value = {"stories", "user-stories"}, allEntries = true)
    public void deleteStory(Long id) {
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Story not found"));

        storyRepository.delete(story);
        log.info("Story deleted: {}", id);
    }

    // ==================== HELPER METHODS ====================

    private Tag getOrCreateTag(String tagName) {
        return tagRepository.findByName(tagName.toLowerCase())
                .orElseGet(() -> {
                    Tag newTag = Tag.builder()
                            .name(tagName.toLowerCase())
                            .build();
                    return tagRepository.save(newTag);
                });
    }

    private StoryResponse convertToResponse(Story story) {
        return StoryResponse.builder()
                .id(story.getId())
                .userId(story.getUser().getId())
                .userName(story.getUser().getName())
                .userAvatar(story.getUser().getAvatarUrl())
                .title(story.getTitle())
                .transcript(story.getTranscript())
                .enhancedStory(story.getEnhancedStory())
                .summary(story.getSummary())
                .audioUrl(story.getAudioUrl())
                .imageUrl(story.getImageUrl())
                .category(story.getCategory().toString())
                .sentimentLabel(story.getSentimentLabel())
                .sentimentScore(story.getSentimentScore() != null ?
                        story.getSentimentScore().doubleValue() : null)
                .wordCount(story.getWordCount())
                .viewsCount(story.getViewsCount())
                .isPublic(story.getIsPublic())
                .tags(story.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toList()))
                .emotions(story.getEmotions().stream()
                        .map(e -> new StoryResponse.EmotionDTO(
                                e.getEmotionType(),
                                e.getConfidence().doubleValue()
                        ))
                        .collect(Collectors.toList()))
                .reactionCounts(new StoryResponse.ReactionCounts(
                        story.getReactionCount("HEART"),
                        story.getReactionCount("SMILE"),
                        story.getReactionCount("CRY")
                ))
                .commentsCount(story.getComments().size())
                .createdAt(story.getCreatedAt())
                .updatedAt(story.getUpdatedAt())
                .build();
    }
}