package com.winwin.backend.auth;

import com.winwin.backend.auth.dto.AuthTokenResponse;
import com.winwin.backend.auth.dto.LoginRequest;
import com.winwin.backend.auth.dto.MeResponse;
import com.winwin.backend.auth.dto.SignupRequest;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.security.JwtTokenProvider;
import com.winwin.backend.user.UserAccount;
import com.winwin.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthService(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      JwtTokenProvider jwtTokenProvider) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @Transactional
  public AuthTokenResponse signup(SignupRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
    }

    UserAccount user = new UserAccount();
    user.setEmail(request.email().trim().toLowerCase());
    user.setPasswordHash(passwordEncoder.encode(request.password()));
    user.setName(request.name().trim());
    user.setRole(request.role());

    UserAccount savedUser = userRepository.save(user);
    return toTokenResponse(savedUser);
  }

  @Transactional(readOnly = true)
  public AuthTokenResponse login(LoginRequest request) {
    UserAccount user =
        userRepository
            .findByEmail(request.email().trim().toLowerCase())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

    if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    return toTokenResponse(user);
  }

  @Transactional(readOnly = true)
  public MeResponse getMe(AuthenticatedUser authenticatedUser) {
    UserAccount user =
        userRepository
            .findById(authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    return new MeResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
  }

  private AuthTokenResponse toTokenResponse(UserAccount user) {
    return new AuthTokenResponse(
        user.getId(),
        user.getEmail(),
        user.getName(),
        user.getRole(),
        jwtTokenProvider.generateAccessToken(user));
  }
}
