package com.winwin.backend.consultation;

import com.winwin.backend.consultation.dto.ConsultationResponse;
import com.winwin.backend.consultation.dto.SendBookingRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/partner/consultations")
public class PartnerConsultationController {

  private final ConsultationService consultationService;

  public PartnerConsultationController(ConsultationService consultationService) {
    this.consultationService = consultationService;
  }

  @GetMapping
  public List<ConsultationResponse> getPartnerConsultations(
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.getPartnerConsultations(authenticatedUser);
  }

  @GetMapping("/{postId}")
  public ConsultationResponse getPartnerConsultation(
      @PathVariable Long postId, @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.getPartnerConsultation(postId, authenticatedUser);
  }

  @PostMapping("/{postId}/messages")
  public ConsultationResponse sendPartnerMessage(
      @PathVariable Long postId,
      @Valid @RequestBody SendConsultationMessageRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.sendPartnerTextMessage(postId, request, authenticatedUser);
  }

  @PostMapping("/{postId}/images")
  public ConsultationResponse sendPartnerImage(
      @PathVariable Long postId,
      @RequestParam("file") MultipartFile file,
      @RequestParam(value = "content", required = false) String content,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.sendPartnerImageMessage(postId, content, file, authenticatedUser);
  }

  @PostMapping("/{postId}/booking-request")
  public ConsultationResponse sendPartnerBookingRequest(
      @PathVariable Long postId,
      @Valid @RequestBody SendBookingRequest request,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.sendPartnerBookingRequest(postId, request, authenticatedUser);
  }

  @PostMapping("/{postId}/close")
  public ConsultationResponse closePartnerConsultation(
      @PathVariable Long postId,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.closePartnerConsultation(postId, authenticatedUser);
  }

  @PostMapping("/{postId}/confirm-transfer")
  public ConsultationResponse confirmPartnerTransfer(
      @PathVariable Long postId,
      @AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return consultationService.confirmPartnerTransfer(postId, authenticatedUser);
  }
}
