package com.example.memory_keeper.exception;
// src/main/java/com/example/memory_keeper/exception/UnauthorizedException.java
package com.example.memory_keeper.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}