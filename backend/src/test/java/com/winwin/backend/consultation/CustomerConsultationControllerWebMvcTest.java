package com.winwin.backend.consultation;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.winwin.backend.api.ApiExceptionHandler;
import com.winwin.backend.config.SecurityConfig;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.security.JwtAuthenticationFilter;
import com.winwin.backend.security.JwtTokenProvider;
import com.winwin.backend.security.RestAuthenticationEntryPoint;
import com.winwin.backend.user.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CustomerConsultationController.class)
@Import({
  SecurityConfig.class,
  ApiExceptionHandler.class,
  RestAuthenticationEntryPoint.class,
  JwtAuthenticationFilter.class
})
class CustomerConsultationControllerWebMvcTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private ConsultationService consultationService;

  @MockBean private JwtTokenProvider jwtTokenProvider;

  @Test
  void getCustomerConsultationsReturnsStructuredUnauthorizedWhenMissingToken() throws Exception {
    mockMvc
        .perform(get("/api/customer/consultations"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
        .andExpect(
            jsonPath("$.message")
                .value("Authentication is required to access this resource"))
        .andExpect(jsonPath("$.path").value("/api/customer/consultations"));
  }

  @Test
  void sendCustomerMessageReturnsValidationErrorForBlankContent() throws Exception {
    when(jwtTokenProvider.parse("test-token"))
        .thenReturn(new AuthenticatedUser(10L, "customer@example.com", UserRole.CUSTOMER));

    mockMvc
        .perform(
            post("/api/customer/consultations/5/messages")
                .header(HttpHeaders.AUTHORIZATION, "Bearer test-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "content": "   "
                    }
                    """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"))
        .andExpect(jsonPath("$.path").value("/api/customer/consultations/5/messages"))
        .andExpect(jsonPath("$.fieldErrors[0].field").value("content"));

    verifyNoInteractions(consultationService);
  }
}
