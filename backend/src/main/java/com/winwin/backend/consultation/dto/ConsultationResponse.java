package com.winwin.backend.consultation.dto;

import java.util.List;

public record ConsultationResponse(
    Long postId,
    String customerName,
    String customerNote,
    String statusLabel,
    String statusTone,
    String summary,
    Integer unreadCount,
    String updatedAt,
    ConsultationBookingFlowResponse bookingFlow,
    List<ConsultationMessageResponse> messages) {}
