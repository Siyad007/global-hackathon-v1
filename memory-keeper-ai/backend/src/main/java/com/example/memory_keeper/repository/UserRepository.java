package com.example.memory_keeper.repository;
// src/main/java/com/memorykeeper/repository/UserRepository.java
package com.memorykeeper.repository;

import com.memorykeeper.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}