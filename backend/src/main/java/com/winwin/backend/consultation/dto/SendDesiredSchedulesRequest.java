package com.winwin.backend.consultation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record SendDesiredSchedulesRequest(
    @NotEmpty List<@Valid ConsultationScheduleOptionRequest> options) {}
