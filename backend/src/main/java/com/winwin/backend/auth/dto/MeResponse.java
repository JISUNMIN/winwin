package com.winwin.backend.auth.dto;

import com.winwin.backend.user.UserRole;

public record MeResponse(Long id, String email, String name, UserRole role) {}
