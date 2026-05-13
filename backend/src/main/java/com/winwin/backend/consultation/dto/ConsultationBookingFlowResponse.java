package com.winwin.backend.consultation.dto;

public record ConsultationBookingFlowResponse(
    String status, Integer desiredScheduleCount, ConsultationBookingSelectionResponse selectedBooking) {}
