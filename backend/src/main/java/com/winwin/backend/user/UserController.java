package com.winwin.backend.user;

import com.winwin.backend.auth.AuthService;
import com.winwin.backend.auth.dto.MeResponse;
import com.winwin.backend.security.AuthenticatedUser;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final AuthService authService;

  public UserController(AuthService authService) {
    this.authService = authService;
  }

  @GetMapping("/me")
  public MeResponse me(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return authService.getMe(authenticatedUser);
  }
}
