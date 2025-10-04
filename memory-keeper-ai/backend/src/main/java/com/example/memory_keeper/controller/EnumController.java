// src/main/java/com/example/memory_keeper/controller/EnumController.java
package com.example.memory_keeper.controller;

import com.example.memory_keeper.dto.response.ApiResponse;
import com.example.memory_keeper.model.enums.EmotionType;
import com.example.memory_keeper.model.enums.ReactionType;
import com.example.memory_keeper.model.enums.StoryCategory;
import com.example.memory_keeper.model.enums.UserRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/enums")
@CrossOrigin(origins = "*")
@Tag(name = "Enums", description = "Get all enum values for frontend")
public class EnumController {

    @GetMapping("/emotions")
    @Operation(summary = "Get all emotion types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEmotionTypes() {
        List<Map<String, Object>> emotions = Arrays.stream(EmotionType.values())
                .map(emotion -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("value", emotion.name());
                    map.put("label", emotion.getDisplayName());
                    map.put("emoji", emotion.getEmoji());
                    map.put("description", emotion.getDescription());
                    map.put("isPositive", emotion.isPositive());
                    map.put("isNegative", emotion.isNegative());
                    map.put("intensity", emotion.getIntensityLevel());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(emotions));
    }

    @GetMapping("/reactions")
    @Operation(summary = "Get all reaction types")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getReactionTypes() {
        List<Map<String, Object>> reactions = Arrays.stream(ReactionType.values())
                .map(reaction -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("value", reaction.name());
                    map.put("label", reaction.getLabel());
                    map.put("emoji", reaction.getEmoji());
                    map.put("description", reaction.getDescription());
                    map.put("color", reaction.getColor());
                    map.put("displayName", reaction.getDisplayName());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(reactions));
    }

    @GetMapping("/reactions/primary")
    @Operation(summary = "Get primary reaction types (most used)")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPrimaryReactions() {
        List<Map<String, Object>> reactions = Arrays.stream(ReactionType.getPrimaryReactions())
                .map(reaction -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("value", reaction.name());
                    map.put("emoji", reaction.getEmoji());
                    map.put("label", reaction.getLabel());
                    map.put("color", reaction.getColor());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(reactions));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all story categories")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getStoryCategories() {
        List<Map<String, String>> categories = Arrays.stream(StoryCategory.values())
                .map(category -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", category.name());
                    map.put("label", category.name().replace("_", " "));
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/roles")
    @Operation(summary = "Get all user roles")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getUserRoles() {
        List<Map<String, String>> roles = Arrays.stream(UserRole.values())
                .map(role -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("value", role.name());
                    map.put("label", role.name().replace("_", " "));
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(roles));
    }
}