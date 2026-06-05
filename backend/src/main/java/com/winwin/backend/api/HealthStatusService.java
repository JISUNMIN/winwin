package com.winwin.backend.api;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HealthStatusService {

  private final String appEnvironment;
  private final String storageMode;
  private final String uploadDirectory;
  private final String supabaseUrl;
  private final String supabaseBucket;

  public HealthStatusService(
      @Value("${app.environment:development}") String appEnvironment,
      @Value("${app.storage.mode:local}") String storageMode,
      @Value("${app.upload-dir:uploads}") String uploadDirectory,
      @Value("${app.storage.supabase.url:}") String supabaseUrl,
      @Value("${app.storage.supabase.bucket:}") String supabaseBucket) {
    this.appEnvironment = appEnvironment;
    this.storageMode = storageMode;
    this.uploadDirectory = uploadDirectory;
    this.supabaseUrl = supabaseUrl;
    this.supabaseBucket = supabaseBucket;
  }

  public HealthResponse getHealth() {
    if (storageMode.trim().equalsIgnoreCase("supabase")) {
      boolean storageReady = !supabaseUrl.isBlank() && !supabaseBucket.isBlank();

      return new HealthResponse(
          storageReady ? "ok" : "degraded",
          "winwin-backend",
          appEnvironment,
          storageReady,
          storageReady ? supabaseUrl + "/storage/v1/object/public/" + supabaseBucket : "supabase-not-configured");
    }

    Path uploadPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    boolean uploadDirectoryReady = false;

    try {
      Files.createDirectories(uploadPath);
      uploadDirectoryReady = Files.isDirectory(uploadPath) && Files.isWritable(uploadPath);
    } catch (IOException ignored) {
      uploadDirectoryReady = false;
    }

    return new HealthResponse(
        uploadDirectoryReady ? "ok" : "degraded",
        "winwin-backend",
        appEnvironment,
        uploadDirectoryReady,
        uploadPath.toString());
  }

  public record HealthResponse(
      String status,
      String service,
      String environment,
      boolean uploadDirectoryReady,
      String uploadDirectory) {}
}
