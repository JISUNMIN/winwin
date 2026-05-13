package com.winwin.backend.consultation;

import com.winwin.backend.consultation.dto.ConsultationResponse;
import com.winwin.backend.security.AuthenticatedUser;
import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
