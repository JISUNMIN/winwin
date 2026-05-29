package com.winwin.backend.consultation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ConsultationScheduleOptionRequest(
    @NotNull LocalDate date, @NotBlank String time) {}
