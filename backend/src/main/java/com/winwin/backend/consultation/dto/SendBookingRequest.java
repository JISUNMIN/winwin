package com.winwin.backend.consultation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record SendBookingRequest(
    @NotNull LocalDate date, @NotBlank String time, @NotNull @Min(0) Integer deposit) {}
