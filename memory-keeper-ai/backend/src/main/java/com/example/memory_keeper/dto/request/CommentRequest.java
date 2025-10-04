package com.example.memory_keeper.dto.request;
// src/main/java/com/example/memory_keeper/dto/request/CommentRequest.java
package com.example.memory_keeper.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {

    @NotNull(message = "Story ID is required")
    private Long storyId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Content is required")
    private String content;

    private Long parentId;
}