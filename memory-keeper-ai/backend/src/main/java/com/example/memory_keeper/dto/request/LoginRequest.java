package com.example.memory_keeper.dto.request;
// src/main/java/com/memorykeeper/dto/request/LoginRequest.java
package com.memorykeeper.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}