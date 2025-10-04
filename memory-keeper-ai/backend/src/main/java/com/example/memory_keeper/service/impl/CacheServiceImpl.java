package com.example.memory_keeper.service.impl;
// src/main/java/com/example/memory_keeper/service/impl/CacheServiceImpl.java
package com.example.memory_keeper.service.impl;

import com.example.memory_keeper.service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CacheServiceImpl implements CacheService {

    private final CacheManager cacheManager;
    private static final String CACHE_NAME = "memorykeeper-cache";

    @Override
    public void put(String key, Object value) {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.put(key, value);
            log.debug("Cached value for key: {}", key);
        }
    }

    @Override
    public Object get(String key) {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            Cache.ValueWrapper wrapper = cache.get(key);
            return wrapper != null ? wrapper.get() : null;
        }
        return null;
    }

    @Override
    public void evict(String key) {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.evict(key);
            log.debug("Evicted cache for key: {}", key);
        }
    }

    @Override
    public void evictAll() {
        Cache cache = cacheManager.getCache(CACHE_NAME);
        if (cache != null) {
            cache.clear();
            log.info("Cleared all cache");
        }
    }
}