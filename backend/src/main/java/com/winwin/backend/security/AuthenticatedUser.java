package com.winwin.backend.security;

import com.winwin.backend.user.UserRole;

public record AuthenticatedUser(Long userId, String email, UserRole role) {}
