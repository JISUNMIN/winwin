package com.winwin.backend.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

  private final HealthStatusService healthStatusService;

  public HealthController(HealthStatusService healthStatusService) {
    this.healthStatusService = healthStatusService;
  }

  @GetMapping("/health")
  public HealthStatusService.HealthResponse health() {
    return healthStatusService.getHealth();
  }
}
