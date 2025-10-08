// src/main/java/com/example/memory_keeper/repository/UserRepository.java
package com.example.memory_keeper.repository;

import com.example.memory_keeper.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- ADD THIS IMPORT
import org.springframework.data.repository.query.Param; // <-- ADD THIS IMPORT
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // This is your existing method, it's fine.
    boolean existsByEmail(String email);

    // --- START OF FIX ---
    /**
     * Finds a user by email and EAGERLY fetches the associated family.
     * The "JOIN FETCH u.family" is the magic that solves the lazy loading issue.
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.family WHERE u.email = :email")
    Optional<User> findByEmailWithFamily(@Param("email") String email);
    // --- END OF FIX ---

    // We can keep the old one too, just in case
    Optional<User> findByEmail(String email);
}