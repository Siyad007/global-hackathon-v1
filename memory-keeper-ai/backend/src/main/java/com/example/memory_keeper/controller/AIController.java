package com.example.memory_keeper.controller;


import com.example.memory_keeper.dto.request.ChatRequest;
import com.example.memory_keeper.dto.request.EnhanceRequest;
import com.example.memory_keeper.dto.response.AIResponse;
import com.example.memory_keeper.dto.response.ApiResponse;
import com.example.memory_keeper.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "AI", description = "AI-powered features")
public class AIController {

    private final AIService aiService;

    @PostMapping("/enhance")
    @Operation(summary = "Enhance story with AI")
    public ResponseEntity<ApiResponse<AIResponse>> enhanceStory(
            @Valid @RequestBody EnhanceRequest request) {

        AIResponse response = aiService.enhanceStory(
                request.getTranscript(),
                request.getAdditionalAnswers()
        );

        return ResponseEntity.ok(ApiResponse.success(response, "Story enhanced successfully"));
    }

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI grandparent")
    public ResponseEntity<ApiResponse<String>> chat(
            @Valid @RequestBody ChatRequest request) {

        String answer = aiService.chatWithGrandparent(
                request.getStories(),
                request.getQuestion(),
                request.getGrandparentName()
        );

        return ResponseEntity.ok(ApiResponse.success(answer, "Response generated"));
    }

    @GetMapping("/prompt")
    @Operation(summary = "Get daily prompt")
    public ResponseEntity<ApiResponse<String>> getDailyPrompt(
            @RequestParam(defaultValue = "GENERAL") String category) {

        String prompt = aiService.generateDailyPrompt(category);
        return ResponseEntity.ok(ApiResponse.success(prompt));
    }

    @PostMapping("/image")
    @Operation(summary = "Generate image for story")
    public ResponseEntity<ApiResponse<String>> generateImage(
            @RequestParam String story,
            @RequestParam String title) {

        aiService.generateStoryImage(story, title)
                .thenAccept(imageUrl -> {
                    // Store image URL in database
                });

        return ResponseEntity.accepted()
                .body(ApiResponse.success(null, "Image generation started"));
    }
}
