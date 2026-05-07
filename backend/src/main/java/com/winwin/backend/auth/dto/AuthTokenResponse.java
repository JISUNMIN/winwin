package com.winwin.backend.auth.dto;

import com.winwin.backend.user.UserRole;

public record AuthTokenResponse(Long userId, String email, String name, UserRole role, String accessToken) {}
