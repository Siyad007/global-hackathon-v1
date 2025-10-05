package com.example.memory_keeper.config;

import com.example.memory_keeper.security.CustomUserDetailsService;
import com.example.memory_keeper.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Make sure this import is present
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF protection as we are using stateless JWT authentication
                .csrf(AbstractHttpConfigurer::disable)

                // This line is crucial. It tells Spring to use the CORS configuration
                // defined elsewhere (like in your WebConfig or CorsConfig bean).
                .cors(cors -> {})

                // Configure authorization rules for different endpoints
                .authorizeHttpRequests(auth -> auth
                        // --- START OF THE CRITICAL FIX for 403 Forbidden on OPTIONS ---
                        // Allow all CORS pre-flight OPTIONS requests to pass through security
                        // without needing authentication. This is essential for frontend apps.
                        .requestMatchers(HttpMethod.OPTIONS, "/").permitAll()
                        // --- END OF THE CRITICAL FIX ---

                        // Publicly accessible endpoints
                        .requestMatchers("/api/auth/").permitAll()
                        .requestMatchers("/api-docs/", "/swagger-ui/", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/").permitAll()

                        // All other requests must be authenticated
                        .anyRequest().authenticated()
                )

                // Configure session management to be stateless, as we use JWT
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Set the custom authentication provider
                .authenticationProvider(authenticationProvider())

                // Add the JWT filter before the standard username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Defines the authentication provider, linking the UserDetailsService and PasswordEncoder.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);

        // Make sure you have a PasswordEncoder bean available
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Exposes the AuthenticationManager as a bean for use in the AuthService.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Defines the password encoder bean.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}