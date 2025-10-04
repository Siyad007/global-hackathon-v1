package com.example.memory_keeper.dto.request;
// src/main/java/com/memorykeeper/dto/request/ChatRequest.java
package com.memorykeeper.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {

    @NotEmpty(message = "Stories are required")
    private List<String> stories;

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Grandparent name is required")
    private String grandparentName;
}