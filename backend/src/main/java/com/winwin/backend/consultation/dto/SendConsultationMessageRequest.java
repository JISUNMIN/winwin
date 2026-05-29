package com.winwin.backend.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendConsultationMessageRequest(
    @NotBlank @Size(max = 500) String content) {}
