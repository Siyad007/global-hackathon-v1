package com.example.memory_keeper.exception;
// src/main/java/com/example/memory_keeper/exception/BadRequestException.java
package com.example.memory_keeper.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}