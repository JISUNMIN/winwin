package com.winwin.backend.consultation.dto;

import java.util.List;

public record ConsultationMessageResponse(
    String id,
    String senderRole,
    String type,
    String content,
    String createdAt,
    String imageUrl,
    List<ConsultationScheduleOptionResponse> desiredScheduleOptions,
    ConsultationBookingSelectionResponse bookingData) {}
