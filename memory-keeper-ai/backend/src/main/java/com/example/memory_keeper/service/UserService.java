package com.example.memory_keeper.service.impl;
// src/main/java/com/example/memory_keeper/service/UserService.java
package com.example.memory_keeper.service;

import com.example.memory_keeper.model.entity.User;

import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}