package com.example.memory_keeper.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.memory_keeper.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadAudio(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "video",
                            "folder", "memory-keeper/audio",
                            "format", "mp3"
                    )
            );

            String url = uploadResult.get("secure_url").toString();
            log.info("Audio uploaded: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Audio upload failed", e);
            throw new RuntimeException("Audio upload failed: " + e.getMessage());
        }
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "memory-keeper/images",
                            "transformation", new com.cloudinary.Transformation()
                                    .width(1024)
                                    .height(1024)
                                    .crop("limit")
                    )
            );

            String url = uploadResult.get("secure_url").toString();
            log.info("Image uploaded: {}", url);
            return url;

        } catch (IOException e) {
            log.error("Image upload failed", e);
            throw new RuntimeException("Image upload failed: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("File deleted: {}", publicId);
        } catch (IOException e) {
            log.error("File deletion failed", e);
        }
    }
}