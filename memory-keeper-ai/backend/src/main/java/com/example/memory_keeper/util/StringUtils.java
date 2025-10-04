package com.example.memory_keeper.util;
// src/main/java/com/example/memory_keeper/util/StringUtils.java
package com.example.memory_keeper.util;

public class StringUtils {

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    public static String truncate(String str, int maxLength) {
        if (str == null || str.length() <= maxLength) {
            return str;
        }
        return str.substring(0, maxLength) + "...";
    }

    public static String sanitize(String str) {
        if (str == null) {
            return null;
        }
        return str.trim().replaceAll("[<>]", "");
    }
}