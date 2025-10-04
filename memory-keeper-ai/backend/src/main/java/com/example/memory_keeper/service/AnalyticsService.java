package com.example.memory_keeper.service;

import com.example.memory_keeper.dto.response.AnalyticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getUserAnalytics(Long userId);
}