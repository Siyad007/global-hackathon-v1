package com.example.memory_keeper.service.impl;
// src/main/java/com/example/memory_keeper/service/impl/UserServiceImpl.java
package com.example.memory_keeper.service.impl;

import com.example.memory_keeper.exception.ResourceNotFoundException;
import com.example.memory_keeper.model.entity.User;
import com.example.memory_keeper.repository.UserRepository;
import com.example.memory_keeper.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User updateUser(Long id, User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        existingUser.setName(user.getName());
        existingUser.setBio(user.getBio());
        existingUser.setAvatarUrl(user.getAvatarUrl());

        return userRepository.save(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}