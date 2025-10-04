package com.example.memory_keeper.service;
// src/main/java/com/example/memory_keeper/service/EmailService.java
package com.example.memory_keeper.service;

public interface EmailService {
    void sendWelcomeEmail(String to, String name);
    void sendStoryNotification(String to, String storyTitle);
    void sendTimeCapsuleDelivery(String to, String title, String message);
}