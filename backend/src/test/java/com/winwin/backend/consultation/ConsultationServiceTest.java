package com.winwin.backend.consultation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import com.winwin.backend.consultation.dto.SendDesiredSchedulesRequest;
import com.winwin.backend.consultation.dto.ConsultationScheduleOptionRequest;
import com.winwin.backend.post.MatchingPost;
import com.winwin.backend.post.MatchingPostRepository;
import com.winwin.backend.post.PostStatus;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.user.UserAccount;
import com.winwin.backend.user.UserRepository;
import com.winwin.backend.user.UserRole;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class ConsultationServiceTest {

  @Mock private ConsultationRepository consultationRepository;
  @Mock private ConsultationMessageRepository consultationMessageRepository;
  @Mock private MatchingPostRepository matchingPostRepository;
  @Mock private UserRepository userRepository;
  @Mock private ConsultationImageStorage consultationImageStorage;

  private ConsultationService consultationService;

  @BeforeEach
  void setUp() {
    consultationService =
        new ConsultationService(
            consultationRepository,
            consultationMessageRepository,
            matchingPostRepository,
            userRepository,
            consultationImageStorage);
  }

  @Test
  void sendCustomerDesiredSchedulesCreatesConsultationAndUpdatesReviewState() {
    AuthenticatedUser authenticatedUser =
        new AuthenticatedUser(10L, "customer@example.com", UserRole.CUSTOMER);
    MatchingPost post = createPost(5L);
    UserAccount customer = createCustomer(10L, "김고객");
    AtomicReference<ConsultationMessage> savedMessage = new AtomicReference<>();

    when(consultationRepository.findByPostIdAndCustomerId(5L, 10L)).thenReturn(Optional.empty());
    when(matchingPostRepository.findWithDetailsById(5L)).thenReturn(Optional.of(post));
    when(userRepository.findById(10L)).thenReturn(Optional.of(customer));
    when(consultationRepository.save(any(Consultation.class)))
        .thenAnswer(
            invocation -> {
              Consultation consultation = invocation.getArgument(0);
              ReflectionTestUtils.setField(consultation, "id", 99L);
              return consultation;
            });
    when(consultationMessageRepository.save(any(ConsultationMessage.class)))
        .thenAnswer(
            invocation -> {
              ConsultationMessage message = invocation.getArgument(0);
              savedMessage.set(message);
              return message;
            });
    when(consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(anyLong()))
        .thenAnswer(invocation -> List.of(savedMessage.get()));

    var response =
        consultationService.sendCustomerDesiredSchedules(
            5L,
            new SendDesiredSchedulesRequest(
                List.of(
                    new ConsultationScheduleOptionRequest(LocalDate.of(2026, 6, 1), "14:00"),
                    new ConsultationScheduleOptionRequest(LocalDate.of(2026, 6, 2), "15:00"))),
            authenticatedUser);

    assertThat(response.statusLabel()).isEqualTo("검토중");
    assertThat(response.statusTone()).isEqualTo("review");
    assertThat(response.bookingFlow().status()).isEqualTo("reviewing-schedules");
    assertThat(response.bookingFlow().desiredScheduleCount()).isEqualTo(2);
    assertThat(response.messages()).hasSize(1);
    assertThat(response.messages().get(0).type()).isEqualTo("desired-schedule");
    assertThat(response.messages().get(0).desiredScheduleOptions()).hasSize(2);
  }

  @Test
  void getPartnerConsultationMarksUnreadCountAsRead() {
    Consultation consultation = createConsultation(41L, 7);

    when(consultationRepository.findByPostIdAndPostOwnerId(5L, 1L))
        .thenReturn(Optional.of(consultation));
    when(consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(41L)).thenReturn(List.of());

    var response =
        consultationService.getPartnerConsultation(
            5L, new AuthenticatedUser(1L, "partner@example.com", UserRole.PARTNER));

    assertThat(response.unreadCount()).isZero();
    assertThat(consultation.getUnreadCount()).isZero();
  }

  @Test
  void closePartnerConsultationReturnsClosedTone() {
    Consultation consultation = createConsultation(51L, 3);

    when(consultationRepository.findByPostIdAndPostOwnerId(5L, 1L))
        .thenReturn(Optional.of(consultation));
    when(consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(51L)).thenReturn(List.of());

    var response =
        consultationService.closePartnerConsultation(
            5L, new AuthenticatedUser(1L, "partner@example.com", UserRole.PARTNER));

    assertThat(response.statusLabel()).isEqualTo("종료");
    assertThat(response.statusTone()).isEqualTo("closed");
    assertThat(response.unreadCount()).isZero();
  }

  @Test
  void sendCustomerImageMessageStoresImageAndMarksUnread() {
    AuthenticatedUser authenticatedUser =
        new AuthenticatedUser(10L, "customer@example.com", UserRole.CUSTOMER);
    MatchingPost post = createPost(5L);
    UserAccount customer = createCustomer(10L, "김고객");
    AtomicReference<ConsultationMessage> savedMessage = new AtomicReference<>();

    when(consultationRepository.findByPostIdAndCustomerId(5L, 10L)).thenReturn(Optional.empty());
    when(matchingPostRepository.findWithDetailsById(5L)).thenReturn(Optional.of(post));
    when(userRepository.findById(10L)).thenReturn(Optional.of(customer));
    when(consultationImageStorage.store(any())).thenReturn("/consultations/2026/05/test.jpg");
    when(consultationRepository.save(any(Consultation.class)))
        .thenAnswer(
            invocation -> {
              Consultation consultation = invocation.getArgument(0);
              ReflectionTestUtils.setField(consultation, "id", 77L);
              return consultation;
            });
    when(consultationMessageRepository.save(any(ConsultationMessage.class)))
        .thenAnswer(
            invocation -> {
              ConsultationMessage message = invocation.getArgument(0);
              savedMessage.set(message);
              return message;
            });
    when(consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(anyLong()))
        .thenAnswer(invocation -> List.of(savedMessage.get()));

    var response =
        consultationService.sendCustomerImageMessage(
            5L,
            "탈색 전 상태 사진",
            new MockMultipartFile("file", "hair.jpg", "image/jpeg", new byte[] {1, 2, 3}),
            authenticatedUser);

    assertThat(response.summary()).isEqualTo("고객이 이미지를 보냈어요.");
    assertThat(response.messages()).hasSize(1);
    assertThat(response.messages().get(0).type()).isEqualTo("image");
    assertThat(response.messages().get(0).imageUrl()).isEqualTo("/uploads/consultations/2026/05/test.jpg");
  }

  private MatchingPost createPost(Long id) {
    MatchingPost post = new MatchingPost();
    ReflectionTestUtils.setField(post, "id", id);
    post.setStatus(PostStatus.OPEN);

    UserAccount owner = new UserAccount();
    ReflectionTestUtils.setField(owner, "id", 1L);
    owner.setName("파트너");
    owner.setRole(UserRole.PARTNER);
    post.setOwner(owner);
    return post;
  }

  private UserAccount createCustomer(Long id, String name) {
    UserAccount customer = new UserAccount();
    ReflectionTestUtils.setField(customer, "id", id);
    customer.setName(name);
    customer.setRole(UserRole.CUSTOMER);
    customer.setEmail("customer@example.com");
    customer.setPasswordHash("hash");
    return customer;
  }

  private Consultation createConsultation(Long id, int unreadCount) {
    Consultation consultation = new Consultation();
    ReflectionTestUtils.setField(consultation, "id", id);
    consultation.setPost(createPost(5L));
    consultation.setCustomer(createCustomer(10L, "김고객"));
    consultation.setCustomerNote("메모");
    consultation.setStatusLabel("결제대기");
    consultation.setStatusTone(ConsultationStatusTone.PAYMENT);
    consultation.setSummary("요약");
    consultation.setUnreadCount(unreadCount);
    consultation.setBookingStatus(ConsultationBookingStatus.BOOKING_REQUEST_SENT);
    consultation.setDesiredScheduleCount(1);
    consultation.setUpdatedAt(LocalDateTime.of(2026, 5, 29, 12, 0));
    return consultation;
  }
}
