package com.winwin.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConditionalOnProperty(name = "app.storage.mode", havingValue = "local", matchIfMissing = true)
public class UploadResourceConfig implements WebMvcConfigurer {

  private final String uploadDirectory;

  public UploadResourceConfig(@Value("${app.upload-dir:uploads}") String uploadDirectory) {
    this.uploadDirectory = uploadDirectory;
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    Path absoluteUploadPath = Paths.get(uploadDirectory).toAbsolutePath().normalize();
    registry
        .addResourceHandler("/uploads/**")
        .addResourceLocations(absoluteUploadPath.toUri().toString() + "/");
  }
}
