package com.example.memory_keeper.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnhanceRequest {

    @NotBlank(message = "Transcript is required")
    private String transcript;

    private String additionalAnswers;
}