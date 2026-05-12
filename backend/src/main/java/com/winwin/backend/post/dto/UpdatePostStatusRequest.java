package com.winwin.backend.post.dto;

import com.winwin.backend.post.PostStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePostStatusRequest(@NotNull(message = "status is required") PostStatus status) {}
