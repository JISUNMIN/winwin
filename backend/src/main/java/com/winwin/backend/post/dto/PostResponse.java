package com.winwin.backend.post.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
    Long id,
    String category,
    String shopName,
    String location,
    Double locationLatitude,
    Double locationLongitude,
    String locationDetail,
    Double locationDetailLatitude,
    Double locationDetailLongitude,
    String locationVisibility,
    String service,
    List<String> requirements,
    List<String> availableDates,
    Integer deposit,
    String description,
    String status,
    Long ownerId,
    String ownerName,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
