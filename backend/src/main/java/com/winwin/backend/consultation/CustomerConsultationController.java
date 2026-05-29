package com.winwin.backend.consultation;

import com.winwin.backend.consultation.dto.ConsultationResponse;
import com.winwin.backend.consultation.dto.SendDesiredSchedulesRequest;
import com.winwin.backend.consultation.dto.SendConsultationMessageRequest;
import com.winwin.backend.security.AuthenticatedUser;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customer/consultations")
public class CustomerConsultationController {

  private final ConsultationService consultationService;

  public CustomerConsultationController(ConsultationService consultationService) {
    this.consultationService = consultationService;
  }

  @GetMapping
  public List<ConsultationResponse> getCustomerConsultations(
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.getCustomerConsultations(authenticatedUser);
  }

  @GetMapping("/{postId}")
  public ConsultationResponse getCustomerConsultation(
      @PathVariable Long postId, @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.getCustomerConsultation(postId, authenticatedUser);
  }

  @PostMapping("/{postId}/messages")
  public ConsultationResponse sendCustomerMessage(
      @PathVariable Long postId,
      @Valid @RequestBody SendConsultationMessageRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.sendCustomerTextMessage(postId, request, authenticatedUser);
  }

  @PostMapping("/{postId}/desired-schedules")
  public ConsultationResponse sendCustomerDesiredSchedules(
      @PathVariable Long postId,
      @Valid @RequestBody SendDesiredSchedulesRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.sendCustomerDesiredSchedules(postId, request, authenticatedUser);
  }

  @PostMapping("/{postId}/payment-complete")
  public ConsultationResponse completeCustomerPayment(
      @PathVariable Long postId,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.completeCustomerPayment(postId, authenticatedUser);
  }
}
