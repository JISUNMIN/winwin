package com.winwin.backend.post.dto;

import com.winwin.backend.post.PostCategory;
import com.winwin.backend.post.PostLocationVisibility;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record CreatePostRequest(
    @NotNull(message = "category is required") PostCategory category,
    @NotBlank(message = "shopName is required")
        @Size(max = 120, message = "shopName must be 120 characters or fewer")
        String shopName,
    @NotBlank(message = "location is required")
        @Size(max = 160, message = "location must be 160 characters or fewer")
        String location,
    @NotNull(message = "locationLatitude is required") Double locationLatitude,
    @NotNull(message = "locationLongitude is required") Double locationLongitude,
    @Size(max = 255, message = "locationDetail must be 255 characters or fewer")
        String locationDetail,
    Double locationDetailLatitude,
    Double locationDetailLongitude,
    @NotNull(message = "locationVisibility is required") PostLocationVisibility locationVisibility,
    @NotBlank(message = "service is required")
        @Size(max = 160, message = "service must be 160 characters or fewer")
        String service,
    @NotEmpty(message = "requirements must not be empty") List<@NotBlank String> requirements,
    @NotEmpty(message = "availableDates must not be empty") List<@NotNull LocalDate> availableDates,
    @NotNull(message = "deposit is required")
        @Min(value = 0, message = "deposit must be 0 or greater")
        Integer deposit,
    @Size(max = 1000, message = "description must be 1000 characters or fewer") String description) {}
