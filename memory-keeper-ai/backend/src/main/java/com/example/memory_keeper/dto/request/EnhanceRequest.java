package com.example.memory_keeper.dto.request;
// src/main/java/com/memorykeeper/dto/request/EnhanceRequest.java
package com.memorykeeper.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnhanceRequest {

    @NotBlank(message = "Transcript is required")
    private String transcript;

    private String additionalAnswers;
}