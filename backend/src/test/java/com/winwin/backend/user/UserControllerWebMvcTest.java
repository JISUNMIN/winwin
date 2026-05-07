package com.winwin.backend.user;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.winwin.backend.api.ApiExceptionHandler;
import com.winwin.backend.auth.AuthService;
import com.winwin.backend.config.SecurityConfig;
import com.winwin.backend.security.JwtAuthenticationFilter;
import com.winwin.backend.security.JwtTokenProvider;
import com.winwin.backend.security.RestAuthenticationEntryPoint;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserController.class)
@Import({
  SecurityConfig.class,
  ApiExceptionHandler.class,
  RestAuthenticationEntryPoint.class,
  JwtAuthenticationFilter.class
})
class UserControllerWebMvcTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AuthService authService;

  @MockBean private JwtTokenProvider jwtTokenProvider;

  @Test
  void meReturnsStructuredUnauthorizedErrorWhenMissingToken() throws Exception {
    mockMvc
        .perform(get("/api/users/me"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
        .andExpect(
            jsonPath("$.message")
                .value("Authentication is required to access this resource"))
        .andExpect(jsonPath("$.path").value("/api/users/me"));
  }
}
