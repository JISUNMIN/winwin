package com.winwin.backend.consultation;

import com.winwin.backend.consultation.dto.ConsultationBookingFlowResponse;
import com.winwin.backend.consultation.dto.ConsultationBookingSelectionResponse;
import com.winwin.backend.consultation.dto.ConsultationMessageResponse;
import com.winwin.backend.consultation.dto.ConsultationResponse;
import com.winwin.backend.consultation.dto.ConsultationScheduleOptionResponse;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.user.UserRole;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConsultationService {

  private final ConsultationRepository consultationRepository;
  private final ConsultationMessageRepository consultationMessageRepository;

  public ConsultationService(
      ConsultationRepository consultationRepository,
      ConsultationMessageRepository consultationMessageRepository) {
    this.consultationRepository = consultationRepository;
    this.consultationMessageRepository = consultationMessageRepository;
  }

  @Transactional(readOnly = true)
  public List<ConsultationResponse> getPartnerConsultations(AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);
    return consultationRepository.findByPostOwnerIdOrderByUpdatedAtDesc(authenticatedUser.userId())
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public ConsultationResponse getPartnerConsultation(
      Long postId, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    return toResponse(consultation);
  }

  private void requirePartnerRole(AuthenticatedUser authenticatedUser) {
    if (authenticatedUser.role() != UserRole.PARTNER) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Partner role is required");
    }
  }

  private ConsultationResponse toResponse(Consultation consultation) {
    List<ConsultationMessageResponse> messages =
        consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(consultation.getId()).stream()
            .map(this::toMessageResponse)
            .toList();

    return new ConsultationResponse(
        consultation.getPost().getId(),
        consultation.getCustomer().getName(),
        consultation.getCustomerNote(),
        consultation.getStatusLabel(),
        consultation.getStatusTone().name().toLowerCase(),
        consultation.getSummary(),
        consultation.getUnreadCount(),
        consultation.getUpdatedAt().toString(),
        new ConsultationBookingFlowResponse(
            consultation.getBookingStatus().name().toLowerCase().replace('_', '-'),
            consultation.getDesiredScheduleCount(),
            toBookingSelectionResponse(consultation.getSelectedBooking())),
        messages);
  }

  private ConsultationMessageResponse toMessageResponse(ConsultationMessage message) {
    List<ConsultationScheduleOptionResponse> desiredScheduleOptions =
        message.getDesiredScheduleOptions().isEmpty()
            ? null
            : message.getDesiredScheduleOptions().stream()
                .map(option -> new ConsultationScheduleOptionResponse(option.getDate().toString(), option.getTime()))
                .toList();

    return new ConsultationMessageResponse(
        message.getMessageKey(),
        message.getSenderRole().name().toLowerCase(),
        message.getType().name().toLowerCase().replace('_', '-'),
        message.getContent(),
        message.getCreatedAt().toString(),
        desiredScheduleOptions,
        toBookingSelectionResponse(message.getBookingData()));
  }

  private ConsultationBookingSelectionResponse toBookingSelectionResponse(
      ConsultationBookingSelection selection) {
    if (selection == null) {
      return null;
    }

    return new ConsultationBookingSelectionResponse(
        selection.getDate().toString(), selection.getTime(), selection.getDeposit());
  }
}
