package com.winwin.backend.config;

import com.winwin.backend.security.JwtAuthenticationFilter;
import com.winwin.backend.security.RestAuthenticationEntryPoint;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.Customizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

  @Bean
  SecurityFilterChain securityFilterChain(
      HttpSecurity http,
      JwtAuthenticationFilter jwtAuthenticationFilter,
      RestAuthenticationEntryPoint restAuthenticationEntryPoint)
      throws Exception {
    return http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .sessionManagement(
            session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .exceptionHandling(
            exception ->
                exception.authenticationEntryPoint(restAuthenticationEntryPoint))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/api/health", "/api/auth/**", "/api/posts", "/api/posts/*")
                    .permitAll()
                    .requestMatchers("/uploads/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .build();
  }

  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    List<String> allowedOriginPatterns = new ArrayList<>();
    allowedOriginPatterns.add("http://localhost:*");
    allowedOriginPatterns.add("http://127.0.0.1:*");
    allowedOriginPatterns.add("http://192.168.*:*");
    allowedOriginPatterns.add("http://10.0.2.2:*");
    allowedOriginPatterns.add("https://*.vercel.app");
    allowedOriginPatterns.add("https://winwin-azure.vercel.app");

    configuration.setAllowedOriginPatterns(allowedOriginPatterns);
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
