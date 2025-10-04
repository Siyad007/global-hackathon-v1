package com.example.memory_keeper.controller;

import com.example.memory_keeper.dto.request.StoryRequest;
import com.example.memory_keeper.dto.response.ApiResponse;
import com.example.memory_keeper.dto.response.StoryResponse;
import com.example.memory_keeper.model.entity.Story;
import com.example.memory_keeper.service.StoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Stories", description = "Story management endpoints")
public class StoryController {

    private final StoryService storyService;

    @PostMapping
    @Operation(summary = "Create new story")
    public ResponseEntity<ApiResponse<StoryResponse>> createStory(
            @Valid @RequestBody StoryRequest request) {

        StoryResponse story = storyService.createStory(request);
        return ResponseEntity.ok(ApiResponse.success(story, "Story created successfully"));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all stories by user")
    public ResponseEntity<ApiResponse<List<StoryResponse>>> getUserStories(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<StoryResponse> stories = storyService.getUserStories(
                userId,
                PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return ResponseEntity.ok(ApiResponse.success(
                stories.getContent(),
                "Stories retrieved successfully",
                stories.getTotalElements()
        ));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get story by ID")
    public ResponseEntity<ApiResponse<StoryResponse>> getStory(@PathVariable Long id) {
        StoryResponse story = storyService.getStoryById(id);
        return ResponseEntity.ok(ApiResponse.success(story, "Story retrieved successfully"));
    }

    // In src/main/java/com/example/memory_keeper/controller/StoryController.java

    @PatchMapping("/{id}/react")
    @Operation(summary = "Add reaction to story")
    public ResponseEntity<ApiResponse<StoryResponse>> addReaction(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam(defaultValue = "HEART") ReactionType reactionType) {

        StoryResponse story = storyService.addReaction(id, userId, reactionType);
        return ResponseEntity.ok(ApiResponse.success(story, "Reaction added"));
    }
    @PostMapping("/{id}/comment")
    @Operation(summary = "Add comment to story")
    public ResponseEntity<ApiResponse<StoryResponse>> addComment(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam String content) {

        StoryResponse story = storyService.addComment(id, userId, content);
        return ResponseEntity.ok(ApiResponse.success(story, "Comment added"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search stories")
    public ResponseEntity<ApiResponse<List<StoryResponse>>> searchStories(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<StoryResponse> stories = storyService.searchStories(
                query,
                PageRequest.of(page, size)
        );

        return ResponseEntity.ok(ApiResponse.success(stories.getContent()));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get stories by category")
    public ResponseEntity<ApiResponse<List<StoryResponse>>> getStoriesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<StoryResponse> stories = storyService.getStoriesByCategory(
                category,
                PageRequest.of(page, size)
        );

        return ResponseEntity.ok(ApiResponse.success(stories.getContent()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete story")
    public ResponseEntity<ApiResponse<Void>> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Story deleted successfully"));
    }
}