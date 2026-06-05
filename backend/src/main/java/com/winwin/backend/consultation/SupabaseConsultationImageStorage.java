package com.winwin.backend.consultation;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnProperty(name = "app.storage.mode", havingValue = "supabase")
public class SupabaseConsultationImageStorage implements ConsultationImageStorage {

  private final HttpClient httpClient = HttpClient.newHttpClient();
  private final String supabaseUrl;
  private final String serviceRoleKey;
  private final String bucket;

  public SupabaseConsultationImageStorage(
      @Value("${app.storage.supabase.url}") String supabaseUrl,
      @Value("${app.storage.supabase.service-role-key}") String serviceRoleKey,
      @Value("${app.storage.supabase.bucket}") String bucket) {
    this.supabaseUrl = trimTrailingSlash(supabaseUrl);
    this.serviceRoleKey = serviceRoleKey;
    this.bucket = bucket;
  }

  @Override
  public String store(MultipartFile file) {
    String extension = extractExtension(file.getOriginalFilename());
    LocalDate today = LocalDate.now();
    String objectPath =
        "consultations/"
            + today.getYear()
            + "/"
            + pad(today.getMonthValue())
            + "/"
            + UUID.randomUUID()
            + extension;

    String encodedObjectPath = encodePath(objectPath);
    URI uploadUri =
        URI.create(
            supabaseUrl + "/storage/v1/object/" + bucket + "/" + encodedObjectPath);

    byte[] bytes;
    try {
      bytes = file.getBytes();
    } catch (IOException exception) {
      throw new UncheckedIOException("Failed to read consultation image", exception);
    }

    HttpRequest request =
        HttpRequest.newBuilder(uploadUri)
            .header("Authorization", "Bearer " + serviceRoleKey)
            .header("apikey", serviceRoleKey)
            .header("x-upsert", "true")
            .header("Content-Type", file.getContentType() == null ? "image/jpeg" : file.getContentType())
            .POST(HttpRequest.BodyPublishers.ofByteArray(bytes))
            .build();

    try {
      HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

      if (response.statusCode() < 200 || response.statusCode() >= 300) {
        throw new IllegalStateException(
            "Failed to upload consultation image to Supabase Storage: " + response.body());
      }
    } catch (IOException exception) {
      throw new UncheckedIOException("Failed to upload consultation image", exception);
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException("Supabase upload interrupted", exception);
    }

    return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + encodedObjectPath;
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

  private String trimTrailingSlash(String value) {
    return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
  }

  private String encodePath(String path) {
    return URLEncoder.encode(path, StandardCharsets.UTF_8).replace("+", "%20").replace("%2F", "/");
  }
}
