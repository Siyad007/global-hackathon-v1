package com.example.memory_keeper.exception;
// src/main/java/com/example/memory_keeper/exception/ResourceNotFoundException.java
package com.example.memory_keeper.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}