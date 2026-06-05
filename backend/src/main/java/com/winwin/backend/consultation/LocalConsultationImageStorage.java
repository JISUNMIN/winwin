package com.winwin.backend.consultation;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(name = "app.storage.mode", havingValue = "local", matchIfMissing = true)
public class LocalConsultationImageStorage implements ConsultationImageStorage {

  private final Path uploadRoot;

  public LocalConsultationImageStorage(@Value("${app.upload-dir:uploads}") String uploadDir) {
    this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
  }

  @Override
  public String store(MultipartFile file) {
    String extension = extractExtension(file.getOriginalFilename());
    String fileName = UUID.randomUUID() + extension;
    LocalDate today = LocalDate.now();
    Path relativeDirectory =
        Paths.get("consultations", String.valueOf(today.getYear()), pad(today.getMonthValue()));
    Path targetDirectory = uploadRoot.resolve(relativeDirectory).normalize();
    Path targetFile = targetDirectory.resolve(fileName).normalize();

    try {
      Files.createDirectories(targetDirectory);
      Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);
    } catch (IOException exception) {
      throw new UncheckedIOException("Failed to store consultation image", exception);
    }

    return "/uploads/" + relativeDirectory.resolve(fileName).toString().replace('\\', '/');
  }

  private String extractExtension(String originalFilename) {
    if (originalFilename == null) {
      return ".jpg";
    }

    int index = originalFilename.lastIndexOf('.');

    if (index < 0 || index == originalFilename.length() - 1) {
      return ".jpg";
    }

    String extension = originalFilename.substring(index).toLowerCase(Locale.ROOT);
    return extension.length() <= 10 ? extension : ".jpg";
  }

  private String pad(int value) {
    return value < 10 ? "0" + value : String.valueOf(value);
  }
}
