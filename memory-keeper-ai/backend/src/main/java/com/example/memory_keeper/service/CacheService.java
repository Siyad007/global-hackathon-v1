package com.example.memory_keeper.service;
// src/main/java/com/example/memory_keeper/service/CacheService.java
package com.example.memory_keeper.service;

public interface CacheService {
    void put(String key, Object value);
    Object get(String key);
    void evict(String key);
    void evictAll();
}