package com.winwin.backend.api;

import java.util.List;

public record ApiErrorResponse(
    int status,
    String error,
    String code,
    String message,
    String path,
    List<FieldValidationError> fieldErrors) {

  public record FieldValidationError(String field, String message) {}
}
