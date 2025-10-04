package com.example.memory_keeper.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    String uploadAudio(MultipartFile file);
    String uploadImage(MultipartFile file);
    void deleteFile(String publicId);
}