package com.winwin.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DeploymentGuard {

  private static final String DEFAULT_JWT_SECRET =
      "winwin-local-development-secret-key-change-me-1234567890";

  private final String environment;
  private final String jwtSecret;
  private final String uploadDirectory;

  public DeploymentGuard(
      @Value("${app.environment:development}") String environment,
      @Value("${jwt.secret}") String jwtSecret,
      @Value("${app.upload-dir:uploads}") String uploadDirectory) {
    this.environment = environment;
    this.jwtSecret = jwtSecret;
    this.uploadDirectory = uploadDirectory;
  }

  @PostConstruct
  void validate() {
    if (!isProduction()) {
      return;
    }

    if (DEFAULT_JWT_SECRET.equals(jwtSecret)) {
      throw new IllegalStateException(
          "Production startup blocked: JWT_SECRET must not use the development default value.");
    }

    String normalizedUploadDirectory = uploadDirectory.trim().replace('\\', '/');

    if (normalizedUploadDirectory.equals("uploads")
        || normalizedUploadDirectory.equals("./uploads")
        || normalizedUploadDirectory.equals(".//uploads")) {
      throw new IllegalStateException(
          "Production startup blocked: APP_UPLOAD_DIR should point to a managed persistent directory.");
    }
  }

  private boolean isProduction() {
    String normalized = environment.trim().toLowerCase();
    return normalized.equals("prod") || normalized.equals("production");
  }
}
