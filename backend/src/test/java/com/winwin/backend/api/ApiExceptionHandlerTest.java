package com.winwin.backend.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.winwin.backend.auth.AuthController;
import com.winwin.backend.auth.dto.SignupRequest;
import com.winwin.backend.user.UserRole;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

class ApiExceptionHandlerTest {

  private final ApiExceptionHandler apiExceptionHandler = new ApiExceptionHandler();

  @Test
  void handleValidationExceptionReturnsStructuredError() throws Exception {
    SignupRequest request = new SignupRequest("bad", "123", "", UserRole.PARTNER);
    BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(request, "signupRequest");
    bindingResult.addError(new FieldError("signupRequest", "email", "must be a well-formed email address"));
    bindingResult.addError(
        new FieldError("signupRequest", "password", "size must be between 8 and 100"));
    bindingResult.addError(new FieldError("signupRequest", "name", "must not be blank"));

    Method signupMethod =
        AuthController.class.getMethod("signup", SignupRequest.class);
    MethodParameter methodParameter = new MethodParameter(signupMethod, 0);
    MethodArgumentNotValidException exception =
        new MethodArgumentNotValidException(methodParameter, bindingResult);

    MockHttpServletRequest servletRequest = new MockHttpServletRequest();
    servletRequest.setRequestURI("/api/auth/signup");

    ApiErrorResponse response =
        apiExceptionHandler.handleValidationException(exception, servletRequest);

    assertThat(response.status()).isEqualTo(HttpStatus.BAD_REQUEST.value());
    assertThat(response.code()).isEqualTo("VALIDATION_ERROR");
    assertThat(response.message()).isEqualTo("Request validation failed");
    assertThat(response.path()).isEqualTo("/api/auth/signup");
    assertThat(response.fieldErrors()).hasSize(3);
    assertThat(response.fieldErrors()).extracting(ApiErrorResponse.FieldValidationError::field)
        .containsExactly("email", "password", "name");
  }

  @Test
  void handleResponseStatusExceptionReturnsStructuredError() {
    MockHttpServletRequest servletRequest = new MockHttpServletRequest();
    servletRequest.setRequestURI("/api/auth/signup");

    ApiErrorResponse response =
        apiExceptionHandler.handleResponseStatusException(
            new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists"),
            servletRequest);

    assertThat(response.status()).isEqualTo(HttpStatus.CONFLICT.value());
    assertThat(response.code()).isEqualTo("CONFLICT");
    assertThat(response.message()).isEqualTo("Email already exists");
    assertThat(response.path()).isEqualTo("/api/auth/signup");
    assertThat(response.fieldErrors()).isEmpty();
  }
}
