package com.example.memory_keeper.controller;
// src/main/java/com/memorykeeper/controller/UploadController.java
package com.memorykeeper.controller;

import com.memorykeeper.dto.response.ApiResponse;
import com.memorykeeper.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Upload", description = "File upload endpoints")
public class UploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping("/audio")
    @Operation(summary = "Upload audio file")
    public ResponseEntity<ApiResponse<String>> uploadAudio(
            @RequestParam("file") MultipartFile file) {

        String url = cloudinaryService.uploadAudio(file);
        return ResponseEntity.ok(ApiResponse.success(url, "Audio uploaded successfully"));
    }

    @PostMapping("/image")
    @Operation(summary = "Upload image file")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @RequestParam("file") MultipartFile file) {

        String url = cloudinaryService.uploadImage(file);
        return ResponseEntity.ok(ApiResponse.success(url, "Image uploaded successfully"));
    }
}