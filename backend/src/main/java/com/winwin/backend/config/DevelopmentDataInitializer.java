package com.winwin.backend.config;

import com.winwin.backend.consultation.Consultation;
import com.winwin.backend.consultation.ConsultationBookingSelection;
import com.winwin.backend.consultation.ConsultationBookingStatus;
import com.winwin.backend.consultation.ConsultationMessage;
import com.winwin.backend.consultation.ConsultationMessageRepository;
import com.winwin.backend.consultation.ConsultationMessageType;
import com.winwin.backend.consultation.ConsultationRepository;
import com.winwin.backend.consultation.ConsultationScheduleOption;
import com.winwin.backend.consultation.ConsultationSenderRole;
import com.winwin.backend.consultation.ConsultationStatusTone;
import com.winwin.backend.post.MatchingPost;
import com.winwin.backend.post.MatchingPostRepository;
import com.winwin.backend.post.PostCategory;
import com.winwin.backend.post.PostLocationVisibility;
import com.winwin.backend.post.PostStatus;
import com.winwin.backend.user.UserAccount;
import com.winwin.backend.user.UserRepository;
import com.winwin.backend.user.UserRole;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevelopmentDataInitializer {

  @Bean
  CommandLineRunner seedDevelopmentData(
      UserRepository userRepository,
      MatchingPostRepository matchingPostRepository,
      ConsultationRepository consultationRepository,
      ConsultationMessageRepository consultationMessageRepository,
      PasswordEncoder passwordEncoder) {
    return args -> {
      if (consultationRepository.count() > 0) {
        return;
      }

      UserAccount partner =
          userRepository
              .findByEmail("partner@example.com")
              .orElseGet(
                  () ->
                      saveUser(
                          userRepository,
                          passwordEncoder,
                          "partner@example.com",
                          "파트너 샘플",
                          UserRole.PARTNER));
      UserAccount customer1 =
          userRepository
              .findByEmail("customer1@example.com")
              .orElseGet(
                  () ->
                      saveUser(
                          userRepository,
                          passwordEncoder,
                          "customer1@example.com",
                          "김하늘",
                          UserRole.CUSTOMER));
      UserAccount customer2 =
          userRepository
              .findByEmail("customer2@example.com")
              .orElseGet(
                  () ->
                      saveUser(
                          userRepository,
                          passwordEncoder,
                          "customer2@example.com",
                          "박서연",
                          UserRole.CUSTOMER));
      UserAccount customer3 =
          userRepository
              .findByEmail("customer3@example.com")
              .orElseGet(
                  () ->
                      saveUser(
                          userRepository,
                          passwordEncoder,
                          "customer3@example.com",
                          "최유진",
                          UserRole.CUSTOMER));
      UserAccount customer4 =
          userRepository
              .findByEmail("customer4@example.com")
              .orElseGet(
                  () ->
                      saveUser(
                          userRepository,
                          passwordEncoder,
                          "customer4@example.com",
                          "이소민",
                          UserRole.CUSTOMER));

      MatchingPost post1 =
          savePost(
              matchingPostRepository,
              partner,
              PostCategory.HAIR,
              "블룸 헤어살롱",
              "강남구 역삼동",
              "발레야쥬 염색 + 컷",
              List.of("장발 (어깨 이하)", "탈색 가능", "리뷰 필수"),
              List.of(
                  LocalDate.of(2026, 4, 29),
                  LocalDate.of(2026, 4, 30),
                  LocalDate.of(2026, 5, 1)),
              5000,
              "발레야쥬 염색 전문 살롱입니다. 포트폴리오 촬영을 위한 모델을 모집합니다.");
      MatchingPost post2 =
          savePost(
              matchingPostRepository,
              partner,
              PostCategory.NAIL,
              "네일샵 러블리",
              "마포구 홍대입구",
              "젤네일 + 네일아트",
              List.of("손톱 길이 3mm 이상", "SNS 인증 필수"),
              List.of(LocalDate.of(2026, 4, 26), LocalDate.of(2026, 4, 27)),
              3000,
              "신규 오픈 네일샵입니다. SNS 홍보용 모델을 찾습니다.");
      MatchingPost post3 =
          savePost(
              matchingPostRepository,
              partner,
              PostCategory.EYELASH,
              "아이래쉬 스튜디오",
              "송파구 잠실동",
              "속눈썹 연장 (볼륨 래쉬)",
              List.of("첫 시술 가능", "2시간 소요"),
              List.of(
                  LocalDate.of(2026, 4, 28),
                  LocalDate.of(2026, 4, 30),
                  LocalDate.of(2026, 5, 1)),
              5000,
              "볼륨 래쉬 전문 스튜디오입니다.");
      MatchingPost post5 =
          savePost(
              matchingPostRepository,
              partner,
              PostCategory.ACCOMMODATION,
              "호텔 더 스카이",
              "중구 명동",
              "디럭스룸 1박 (주중)",
              List.of("블로그 리뷰 필수", "사진 10장 이상"),
              List.of(
                  LocalDate.of(2026, 5, 5),
                  LocalDate.of(2026, 5, 6),
                  LocalDate.of(2026, 5, 7)),
              30000,
              "신규 리모델링 호텔입니다.");

      seedConsultation(
          consultationRepository,
          consultationMessageRepository,
          post1,
          customer1,
          "평일 오후 방문 가능, 발레야쥬 시술 경험 있음",
          "검토중",
          ConsultationStatusTone.REVIEW,
          "고객이 희망 일정 3개를 보냈어요. 가능한 시간을 골라 예약 요청을 보내세요.",
          2,
          ConsultationBookingStatus.REVIEWING_SCHEDULES,
          3,
          null,
          LocalDateTime.of(2026, 4, 28, 13, 45),
          List.of(
              message("m1", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "안녕하세요! 블룸 헤어살롱입니다. 지원해주셔서 감사합니다.",
                  LocalDateTime.of(2026, 4, 28, 12, 10)),
              message("m2", ConsultationSenderRole.CUSTOMER, ConsultationMessageType.TEXT,
                  "안녕하세요. 탈색 이력 괜찮고 평일 오후 위주로 방문 가능해요.",
                  LocalDateTime.of(2026, 4, 28, 12, 15)),
              message("m3", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "좋아요. 가능한 방문 시간을 몇 개 알려주시면 확인해볼게요.",
                  LocalDateTime.of(2026, 4, 28, 12, 20)),
              messageWithSchedules(
                  "m4",
                  ConsultationSenderRole.CUSTOMER,
                  ConsultationMessageType.DESIRED_SCHEDULE,
                  "희망 일정을 보냈습니다.",
                  LocalDateTime.of(2026, 4, 28, 13, 27),
                  List.of(
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 29), "14:00"),
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 30), "15:00"),
                      new ConsultationScheduleOption(LocalDate.of(2026, 5, 1), "11:00"))),
              message("m5", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "보내주신 일정 확인했어요. 가능한 시간을 골라 예약 요청을 보낼게요.",
                  LocalDateTime.of(2026, 4, 28, 13, 33)),
              messageWithSchedules(
                  "m6",
                  ConsultationSenderRole.PARTNER,
                  ConsultationMessageType.PARTNER_SCHEDULE_REVIEW,
                  "가능한 일정을 선택해 예약 요청을 보냅니다.",
                  LocalDateTime.of(2026, 4, 28, 13, 34),
                  List.of(
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 29), "14:00"),
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 30), "15:00"),
                      new ConsultationScheduleOption(LocalDate.of(2026, 5, 1), "11:00")))));

      seedConsultation(
          consultationRepository,
          consultationMessageRepository,
          post2,
          customer2,
          "손톱 길이 충분, 주말 오전 선호",
          "결제대기",
          ConsultationStatusTone.PAYMENT,
          "예약 요청을 보낸 상태예요. 고객 결제 완료 여부를 확인해보세요.",
          1,
          ConsultationBookingStatus.BOOKING_REQUEST_SENT,
          2,
          new ConsultationBookingSelection(LocalDate.of(2026, 4, 27), "11:00", 3000),
          LocalDateTime.of(2026, 4, 28, 12, 15),
          List.of(
              message("m1", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "안녕하세요! 네일샵 러블리입니다. 상담 이어가볼게요.",
                  LocalDateTime.of(2026, 4, 28, 8, 15)),
              messageWithSchedules(
                  "m2",
                  ConsultationSenderRole.CUSTOMER,
                  ConsultationMessageType.DESIRED_SCHEDULE,
                  "희망 일정을 보냈습니다.",
                  LocalDateTime.of(2026, 4, 28, 10, 40),
                  List.of(
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 26), "10:00"),
                      new ConsultationScheduleOption(LocalDate.of(2026, 4, 27), "11:00"))),
              message("m3", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "4월 27일 11시 일정으로 가능해요. 아래 요청에서 예약을 확정해주세요.",
                  LocalDateTime.of(2026, 4, 28, 10, 55)),
              messageWithBooking(
                  "m4",
                  ConsultationSenderRole.PARTNER,
                  ConsultationMessageType.BOOKING_REQUEST,
                  "예약 확정 요청을 보냈습니다.",
                  LocalDateTime.of(2026, 4, 28, 10, 56),
                  new ConsultationBookingSelection(LocalDate.of(2026, 4, 27), "11:00", 3000)),
              message("m5", ConsultationSenderRole.CUSTOMER, ConsultationMessageType.TEXT,
                  "확인했어요. 잠시 후 결제할게요.",
                  LocalDateTime.of(2026, 4, 28, 11, 1))));

      seedConsultation(
          consultationRepository,
          consultationMessageRepository,
          post5,
          customer4,
          "명동 방문 경험 있음, 체크인 시간 조율 요청",
          "확정",
          ConsultationStatusTone.CONFIRMED,
          "보증금 결제가 완료됐어요. 방문 전 최종 안내만 남았습니다.",
          0,
          ConsultationBookingStatus.PAYMENT_COMPLETED,
          1,
          new ConsultationBookingSelection(LocalDate.of(2026, 5, 5), "16:00", 30000),
          LocalDateTime.of(2026, 4, 28, 9, 20),
          List.of(
              message("m1", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "안녕하세요! 호텔 더 스카이입니다. 예약 일정 확인 도와드릴게요.",
                  LocalDateTime.of(2026, 4, 28, 1, 20)),
              messageWithSchedules(
                  "m2",
                  ConsultationSenderRole.CUSTOMER,
                  ConsultationMessageType.DESIRED_SCHEDULE,
                  "희망 일정을 보냈습니다.",
                  LocalDateTime.of(2026, 4, 28, 2, 20),
                  List.of(new ConsultationScheduleOption(LocalDate.of(2026, 5, 5), "16:00"))),
              messageWithBooking(
                  "m3",
                  ConsultationSenderRole.PARTNER,
                  ConsultationMessageType.BOOKING_REQUEST,
                  "예약 확정 요청을 보냈습니다.",
                  LocalDateTime.of(2026, 4, 28, 2, 50),
                  new ConsultationBookingSelection(LocalDate.of(2026, 5, 5), "16:00", 30000)),
              message("m4", ConsultationSenderRole.CUSTOMER, ConsultationMessageType.TEXT,
                  "2026-05-05 16:00 예약을 확정했어요. 보증금 결제도 완료했습니다.",
                  LocalDateTime.of(2026, 4, 28, 3, 0)),
              message("m5", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "결제 확인됐습니다. 방문 전날 체크인 안내 메시지 드릴게요.",
                  LocalDateTime.of(2026, 4, 28, 3, 10))));

      seedConsultation(
          consultationRepository,
          consultationMessageRepository,
          post3,
          customer3,
          "첫 시술 가능, 속눈썹 연장 경험 없음",
          "대기",
          ConsultationStatusTone.WAITING,
          "아직 일정 조율 전 단계예요. 고객의 현재 상태와 가능 시간을 먼저 확인해보세요.",
          3,
          ConsultationBookingStatus.IDLE,
          0,
          null,
          LocalDateTime.of(2026, 4, 28, 14, 5),
          List.of(
              message("m1", ConsultationSenderRole.PARTNER, ConsultationMessageType.TEXT,
                  "안녕하세요! 아이래쉬 스튜디오입니다. 시술 가능 여부 먼저 확인할게요.",
                  LocalDateTime.of(2026, 4, 28, 13, 20)),
              message("m2", ConsultationSenderRole.CUSTOMER, ConsultationMessageType.TEXT,
                  "첫 시술이라 궁금한 게 많아요. 시술 시간과 관리 방법도 알고 싶어요.",
                  LocalDateTime.of(2026, 4, 28, 13, 45))));
    };
  }

  private static UserAccount saveUser(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      String email,
      String name,
      UserRole role) {
    UserAccount user = new UserAccount();
    user.setEmail(email);
    user.setName(name);
    user.setRole(role);
    user.setPasswordHash(passwordEncoder.encode("password123"));
    return userRepository.save(user);
  }

  private static MatchingPost savePost(
      MatchingPostRepository repository,
      UserAccount owner,
      PostCategory category,
      String shopName,
      String location,
      String service,
      List<String> requirements,
      List<LocalDate> availableDates,
      Integer deposit,
      String description) {
    MatchingPost post = new MatchingPost();
    post.setOwner(owner);
    post.setCategory(category);
    post.setShopName(shopName);
    post.setLocation(location);
    post.setLocationLatitude(37.5);
    post.setLocationLongitude(127.0);
    post.setLocationVisibility(PostLocationVisibility.SUMMARY_ONLY);
    post.setService(service);
    post.setRequirements(requirements);
    post.setAvailableDates(availableDates);
    post.setDeposit(deposit);
    post.setDescription(description);
    post.setStatus(PostStatus.OPEN);
    return repository.save(post);
  }

  private static void seedConsultation(
      ConsultationRepository consultationRepository,
      ConsultationMessageRepository messageRepository,
      MatchingPost post,
      UserAccount customer,
      String customerNote,
      String statusLabel,
      ConsultationStatusTone statusTone,
      String summary,
      Integer unreadCount,
      ConsultationBookingStatus bookingStatus,
      Integer desiredScheduleCount,
      ConsultationBookingSelection selectedBooking,
      LocalDateTime updatedAt,
      List<ConsultationMessage> messages) {
    Consultation consultation = new Consultation();
    consultation.setPost(post);
    consultation.setCustomer(customer);
    consultation.setCustomerNote(customerNote);
    consultation.setStatusLabel(statusLabel);
    consultation.setStatusTone(statusTone);
    consultation.setSummary(summary);
    consultation.setUnreadCount(unreadCount);
    consultation.setBookingStatus(bookingStatus);
    consultation.setDesiredScheduleCount(desiredScheduleCount);
    consultation.setSelectedBooking(selectedBooking);
    consultation.setCreatedAt(messages.get(0).getCreatedAt());
    consultation.setUpdatedAt(updatedAt);

    Consultation saved = consultationRepository.save(consultation);

    for (ConsultationMessage message : messages) {
      message.setConsultation(saved);
    }

    messageRepository.saveAll(messages);
  }

  private static ConsultationMessage message(
      String key,
      ConsultationSenderRole senderRole,
      ConsultationMessageType type,
      String content,
      LocalDateTime createdAt) {
    ConsultationMessage message = new ConsultationMessage();
    message.setMessageKey(key);
    message.setSenderRole(senderRole);
    message.setType(type);
    message.setContent(content);
    message.setCreatedAt(createdAt);
    return message;
  }

  private static ConsultationMessage messageWithSchedules(
      String key,
      ConsultationSenderRole senderRole,
      ConsultationMessageType type,
      String content,
      LocalDateTime createdAt,
      List<ConsultationScheduleOption> options) {
    ConsultationMessage message = message(key, senderRole, type, content, createdAt);
    message.setDesiredScheduleOptions(options);
    return message;
  }

  private static ConsultationMessage messageWithBooking(
      String key,
      ConsultationSenderRole senderRole,
      ConsultationMessageType type,
      String content,
      LocalDateTime createdAt,
      ConsultationBookingSelection bookingSelection) {
    ConsultationMessage message = message(key, senderRole, type, content, createdAt);
    message.setBookingData(bookingSelection);
    return message;
  }
}
