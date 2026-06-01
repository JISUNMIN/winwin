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
  private final String uploadDirectory;

  public HealthStatusService(
      @Value("${app.environment:development}") String appEnvironment,
      @Value("${app.upload-dir:uploads}") String uploadDirectory) {
    this.appEnvironment = appEnvironment;
    this.uploadDirectory = uploadDirectory;
  }

  public HealthResponse getHealth() {
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
