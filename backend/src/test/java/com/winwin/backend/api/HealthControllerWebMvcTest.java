package com.winwin.backend.api;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

@WebMvcTest(HealthController.class)
@Import({
  SecurityConfig.class,
  RestAuthenticationEntryPoint.class,
  JwtAuthenticationFilter.class
})
class HealthControllerWebMvcTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private HealthStatusService healthStatusService;

  @MockBean private JwtTokenProvider jwtTokenProvider;

  @Test
  void healthReturnsEnvironmentAndUploadReadiness() throws Exception {
    when(healthStatusService.getHealth())
        .thenReturn(
            new HealthStatusService.HealthResponse(
                "ok",
                "winwin-backend",
                "development",
                true,
                "C:\\uploads"));

    mockMvc
        .perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ok"))
        .andExpect(jsonPath("$.service").value("winwin-backend"))
        .andExpect(jsonPath("$.environment").value("development"))
        .andExpect(jsonPath("$.uploadDirectoryReady").value(true))
        .andExpect(jsonPath("$.uploadDirectory").value("C:\\uploads"));
  }
}
