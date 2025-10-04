package com.example.memory_keeper.service.impl;
// src/main/java/com/example/memory_keeper/service/impl/EmailServiceImpl.java
package com.example.memory_keeper.service.impl;

import com.example.memory_keeper.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    @Override
    public void sendWelcomeEmail(String to, String name) {
        log.info("Sending welcome email to: {}", to);
    }

    @Override
    public void sendStoryNotification(String to, String storyTitle) {
        log.info("Sending story notification to: {} for story: {}", to, storyTitle);
    }

    @Override
    public void sendTimeCapsuleDelivery(String to, String title, String message) {
        log.info("Sending time capsule delivery to: {}", to);
    }
}