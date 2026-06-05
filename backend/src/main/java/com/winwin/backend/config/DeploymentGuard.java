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
  private final String storageMode;
  private final String uploadDirectory;
  private final String supabaseUrl;
  private final String supabaseServiceRoleKey;
  private final String supabaseBucket;

  public DeploymentGuard(
      @Value("${app.environment:development}") String environment,
      @Value("${jwt.secret}") String jwtSecret,
      @Value("${app.storage.mode:local}") String storageMode,
      @Value("${app.upload-dir:uploads}") String uploadDirectory,
      @Value("${app.storage.supabase.url:}") String supabaseUrl,
      @Value("${app.storage.supabase.service-role-key:}") String supabaseServiceRoleKey,
      @Value("${app.storage.supabase.bucket:}") String supabaseBucket) {
    this.environment = environment;
    this.jwtSecret = jwtSecret;
    this.storageMode = storageMode;
    this.uploadDirectory = uploadDirectory;
    this.supabaseUrl = supabaseUrl;
    this.supabaseServiceRoleKey = supabaseServiceRoleKey;
    this.supabaseBucket = supabaseBucket;
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

    String normalizedStorageMode = storageMode.trim().toLowerCase();

    if (normalizedStorageMode.equals("supabase")) {
      if (supabaseUrl.isBlank() || supabaseServiceRoleKey.isBlank() || supabaseBucket.isBlank()) {
        throw new IllegalStateException(
            "Production startup blocked: Supabase storage mode requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET.");
      }
      return;
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
