package com.winwin.backend.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.winwin.backend.api.ApiExceptionHandler;
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

@WebMvcTest(AuthController.class)
@Import({
  SecurityConfig.class,
  ApiExceptionHandler.class,
  RestAuthenticationEntryPoint.class,
  JwtAuthenticationFilter.class
})
class AuthControllerWebMvcTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private AuthService authService;

  @MockBean private JwtTokenProvider jwtTokenProvider;

  @Test
  void signupPreflightAllowsVercelProductionOrigin() throws Exception {
    mockMvc
        .perform(
            options("/api/auth/signup")
                .header("Origin", "https://winwin-azure.vercel.app")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "content-type"))
        .andExpect(status().isOk())
        .andExpect(header().string("Access-Control-Allow-Origin", "https://winwin-azure.vercel.app"))
        .andExpect(header().string("Vary", org.hamcrest.Matchers.containsString("Origin")));
  }
}
