package com.example.memory_keeper.controller;
// src/main/java/com/example/memory_keeper/controller/AnalyticsController.java
package com.example.memory_keeper.controller;

import com.example.memory_keeper.dto.response.AnalyticsResponse;
import com.example.memory_keeper.dto.response.ApiResponse;
import com.example.memory_keeper.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Analytics", description = "Analytics and statistics endpoints")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get user analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getUserAnalytics(@PathVariable Long userId) {
        AnalyticsResponse analytics = analyticsService.getUserAnalytics(userId);
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}