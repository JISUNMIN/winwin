package com.winwin.backend.api;

import com.winwin.backend.api.ApiErrorResponse.FieldValidationError;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ApiErrorResponse handleValidationException(
      MethodArgumentNotValidException exception, HttpServletRequest request) {
    List<FieldValidationError> fieldErrors =
        exception.getBindingResult().getFieldErrors().stream()
            .map(this::toFieldValidationError)
            .toList();

    return new ApiErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(),
        "VALIDATION_ERROR",
        "Request validation failed",
        request.getRequestURI(),
        fieldErrors);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ApiErrorResponse handleMessageNotReadable(
      HttpMessageNotReadableException exception, HttpServletRequest request) {
    return new ApiErrorResponse(
        HttpStatus.BAD_REQUEST.value(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(),
        "INVALID_REQUEST_BODY",
        "Request body is missing or malformed",
        request.getRequestURI(),
        List.of());
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ApiErrorResponse handleResponseStatusException(
      ResponseStatusException exception, HttpServletRequest request) {
    HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());

    return new ApiErrorResponse(
        status.value(),
        status.getReasonPhrase(),
        status.name(),
        exception.getReason() != null ? exception.getReason() : status.getReasonPhrase(),
        request.getRequestURI(),
        List.of());
  }

  private FieldValidationError toFieldValidationError(FieldError fieldError) {
    String message =
        fieldError.getDefaultMessage() != null
            ? fieldError.getDefaultMessage()
            : "Invalid value";
    return new FieldValidationError(fieldError.getField(), message);
  }
}
