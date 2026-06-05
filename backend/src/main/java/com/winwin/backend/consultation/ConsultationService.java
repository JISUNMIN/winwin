package com.winwin.backend.consultation;

import com.winwin.backend.consultation.dto.ConsultationBookingFlowResponse;
import com.winwin.backend.consultation.dto.ConsultationBookingSelectionResponse;
import com.winwin.backend.consultation.dto.ConsultationMessageResponse;
import com.winwin.backend.consultation.dto.ConsultationResponse;
import com.winwin.backend.consultation.dto.ConsultationScheduleOptionResponse;
import com.winwin.backend.consultation.dto.ConsultationScheduleOptionRequest;
import com.winwin.backend.consultation.dto.SendBookingRequest;
import com.winwin.backend.consultation.dto.SendConsultationMessageRequest;
import com.winwin.backend.consultation.dto.SendDesiredSchedulesRequest;
import com.winwin.backend.post.MatchingPost;
import com.winwin.backend.post.MatchingPostRepository;
import com.winwin.backend.post.PostStatus;
import com.winwin.backend.security.AuthenticatedUser;
import com.winwin.backend.user.UserAccount;
import com.winwin.backend.user.UserRepository;
import com.winwin.backend.user.UserRole;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ConsultationService {

  private final ConsultationRepository consultationRepository;
  private final ConsultationMessageRepository consultationMessageRepository;
  private final MatchingPostRepository matchingPostRepository;
  private final UserRepository userRepository;
  private final ConsultationImageStorage consultationImageStorage;

  public ConsultationService(
      ConsultationRepository consultationRepository,
      ConsultationMessageRepository consultationMessageRepository,
      MatchingPostRepository matchingPostRepository,
      UserRepository userRepository,
      ConsultationImageStorage consultationImageStorage) {
    this.consultationRepository = consultationRepository;
    this.consultationMessageRepository = consultationMessageRepository;
    this.matchingPostRepository = matchingPostRepository;
    this.userRepository = userRepository;
    this.consultationImageStorage = consultationImageStorage;
  }

  @Transactional(readOnly = true)
  public List<ConsultationResponse> getPartnerConsultations(AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);
    return consultationRepository.findByPostOwnerIdOrderByUpdatedAtDesc(authenticatedUser.userId())
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public ConsultationResponse getPartnerConsultation(
      Long postId, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    markConsultationAsReadForPartner(consultation);
    return toResponse(consultation);
  }

  @Transactional(readOnly = true)
  public ConsultationResponse getCustomerConsultation(Long postId, AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    return toResponse(consultation);
  }

  @Transactional(readOnly = true)
  public List<ConsultationResponse> getCustomerConsultations(AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);
    return consultationRepository.findByCustomerIdOrderByUpdatedAtDesc(authenticatedUser.userId())
        .stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public ConsultationResponse sendPartnerTextMessage(
      Long postId, SendConsultationMessageRequest request, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    appendTextMessage(consultation, ConsultationSenderRole.PARTNER, request.content(), false);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse sendCustomerTextMessage(
      Long postId, SendConsultationMessageRequest request, AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
            .orElseGet(() -> createConsultationForCustomer(postId, authenticatedUser));

    appendTextMessage(consultation, ConsultationSenderRole.CUSTOMER, request.content(), true);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse sendCustomerDesiredSchedules(
      Long postId, SendDesiredSchedulesRequest request, AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
            .orElseGet(() -> createConsultationForCustomer(postId, authenticatedUser));

    List<ConsultationScheduleOption> options =
        request.options().stream().map(this::toScheduleOption).toList();

    appendDesiredScheduleMessage(consultation, options);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse sendPartnerImageMessage(
      Long postId, String content, MultipartFile file, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    appendImageMessage(consultation, ConsultationSenderRole.PARTNER, content, file, false);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse sendCustomerImageMessage(
      Long postId, String content, MultipartFile file, AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
            .orElseGet(() -> createConsultationForCustomer(postId, authenticatedUser));

    appendImageMessage(consultation, ConsultationSenderRole.CUSTOMER, content, file, true);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse sendPartnerBookingRequest(
      Long postId, SendBookingRequest request, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    ConsultationBookingSelection selection =
        new ConsultationBookingSelection(
            request.date(),
            request.time().trim(),
            request.deposit(),
            "국민은행",
            createAccountNumber(postId, request.deposit()),
            consultation.getPost().getOwner().getName());

    appendBookingRequestMessage(consultation, selection);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse reportCustomerTransfer(
      Long postId, AuthenticatedUser authenticatedUser) {
    requireCustomerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndCustomerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    ConsultationBookingSelection selectedBooking = consultation.getSelectedBooking();

    if (selectedBooking == null) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Booking request is required before transfer reporting");
    }

    appendTransferReportedMessage(consultation, selectedBooking);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse confirmPartnerTransfer(
      Long postId, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    ConsultationBookingSelection selectedBooking = consultation.getSelectedBooking();

    if (selectedBooking == null) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Booking request is required before confirmation");
    }

    appendTransferConfirmedMessage(consultation, selectedBooking);
    return toResponse(consultation);
  }

  @Transactional
  public ConsultationResponse closePartnerConsultation(
      Long postId, AuthenticatedUser authenticatedUser) {
    requirePartnerRole(authenticatedUser);

    Consultation consultation =
        consultationRepository
            .findByPostIdAndPostOwnerId(postId, authenticatedUser.userId())
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation not found"));

    consultation.setStatusLabel("종료");
    consultation.setStatusTone(ConsultationStatusTone.CLOSED);
    consultation.setSummary("상담이 종료되었어요. 필요하면 다시 메시지를 이어갈 수 있습니다.");
    consultation.setUnreadCount(0);
    consultation.setUpdatedAt(LocalDateTime.now());

    return toResponse(consultation);
  }

  private void requirePartnerRole(AuthenticatedUser authenticatedUser) {
    if (authenticatedUser.role() != UserRole.PARTNER) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Partner role is required");
    }
  }

  private void requireCustomerRole(AuthenticatedUser authenticatedUser) {
    if (authenticatedUser.role() != UserRole.CUSTOMER) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Customer role is required");
    }
  }

  private Consultation createConsultationForCustomer(Long postId, AuthenticatedUser authenticatedUser) {
    MatchingPost post =
        matchingPostRepository
            .findWithDetailsById(postId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));

    if (post.getStatus() != PostStatus.OPEN) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Closed post cannot start consultation");
    }

    UserAccount customer =
        userRepository
            .findById(authenticatedUser.userId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    Consultation consultation = new Consultation();
    consultation.setPost(post);
    consultation.setCustomer(customer);
    consultation.setCustomerNote("API 세션에서 시작된 상담");
    consultation.setStatusLabel("대기");
    consultation.setStatusTone(ConsultationStatusTone.WAITING);
    consultation.setSummary("고객이 상담을 시작했습니다.");
    consultation.setUnreadCount(0);
    consultation.setBookingStatus(ConsultationBookingStatus.IDLE);
    consultation.setDesiredScheduleCount(0);

    return consultationRepository.save(consultation);
  }

  private void appendTextMessage(
      Consultation consultation,
      ConsultationSenderRole senderRole,
      String content,
      boolean incrementsUnreadCount) {
    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(senderRole);
    message.setType(ConsultationMessageType.TEXT);
    message.setContent(content.trim());
    message.setCreatedAt(LocalDateTime.now());
    consultationMessageRepository.save(message);

    consultation.setSummary(content.trim());
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(
        incrementsUnreadCount ? consultation.getUnreadCount() + 1 : 0);
  }

  private void appendDesiredScheduleMessage(
      Consultation consultation, List<ConsultationScheduleOption> options) {
    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(ConsultationSenderRole.CUSTOMER);
    message.setType(ConsultationMessageType.DESIRED_SCHEDULE);
    message.setContent("희망 일정을 보냈습니다.");
    message.setCreatedAt(LocalDateTime.now());
    message.setDesiredScheduleOptions(options);
    consultationMessageRepository.save(message);

    consultation.setStatusLabel("검토중");
    consultation.setStatusTone(ConsultationStatusTone.REVIEW);
    consultation.setSummary(
        options.size() > 1
            ? "고객이 희망 일정 " + options.size() + "개를 보냈어요. 가능한 시간을 골라 예약 요청을 보내세요."
            : "고객이 희망 일정을 보냈어요. 가능한 시간을 골라 예약 요청을 보내세요.");
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(consultation.getUnreadCount() + 1);
    consultation.setBookingStatus(ConsultationBookingStatus.REVIEWING_SCHEDULES);
    consultation.setDesiredScheduleCount(options.size());
    consultation.setSelectedBooking(null);
  }

  private void appendImageMessage(
      Consultation consultation,
      ConsultationSenderRole senderRole,
      String content,
      MultipartFile file,
      boolean incrementsUnreadCount) {
    validateImageFile(file);

    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(senderRole);
    message.setType(ConsultationMessageType.IMAGE);
    message.setContent(content != null && !content.trim().isEmpty() ? content.trim() : "첨부 이미지");
    message.setImageUrl(consultationImageStorage.store(file));
    message.setCreatedAt(LocalDateTime.now());
    consultationMessageRepository.save(message);

    consultation.setSummary(senderRole == ConsultationSenderRole.CUSTOMER ? "고객이 이미지를 보냈어요." : "파트너가 이미지를 보냈어요.");
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(incrementsUnreadCount ? consultation.getUnreadCount() + 1 : 0);
  }

  private void appendBookingRequestMessage(
      Consultation consultation, ConsultationBookingSelection selection) {
    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(ConsultationSenderRole.PARTNER);
    message.setType(ConsultationMessageType.BOOKING_REQUEST);
    message.setContent("예약 확정 요청을 보냈습니다.");
    message.setCreatedAt(LocalDateTime.now());
    message.setBookingData(selection);
    consultationMessageRepository.save(message);

    consultation.setStatusLabel("입금대기");
    consultation.setStatusTone(ConsultationStatusTone.PAYMENT);
    consultation.setSummary("예약금 계좌이체 안내를 보낸 상태예요. 고객 입금 알림을 기다려보세요.");
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(0);
    consultation.setBookingStatus(ConsultationBookingStatus.BOOKING_REQUEST_SENT);
    consultation.setSelectedBooking(selection);
  }

  private void appendTransferReportedMessage(
      Consultation consultation, ConsultationBookingSelection selection) {
    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(ConsultationSenderRole.CUSTOMER);
    message.setType(ConsultationMessageType.TEXT);
    message.setContent(
        selection.getDate()
            + " "
            + selection.getTime()
            + " 예약금 입금했습니다. 확인 부탁드려요.");
    message.setCreatedAt(LocalDateTime.now());
    consultationMessageRepository.save(message);

    consultation.setStatusLabel("입금확인중");
    consultation.setStatusTone(ConsultationStatusTone.PAYMENT);
    consultation.setSummary("고객이 예약금 입금 알림을 보냈어요. 실제 입금 확인 후 예약을 확정하세요.");
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(consultation.getUnreadCount() + 1);
    consultation.setBookingStatus(ConsultationBookingStatus.TRANSFER_REPORTED);
    consultation.setSelectedBooking(selection);
  }

  private void appendTransferConfirmedMessage(
      Consultation consultation, ConsultationBookingSelection selection) {
    ConsultationMessage message = new ConsultationMessage();
    message.setConsultation(consultation);
    message.setMessageKey("m" + System.currentTimeMillis());
    message.setSenderRole(ConsultationSenderRole.PARTNER);
    message.setType(ConsultationMessageType.TEXT);
    message.setContent(
        selection.getDate()
            + " "
            + selection.getTime()
            + " 예약금 입금 확인되었습니다. 예약이 확정되었어요.");
    message.setCreatedAt(LocalDateTime.now());
    consultationMessageRepository.save(message);

    consultation.setStatusLabel("확정");
    consultation.setStatusTone(ConsultationStatusTone.CONFIRMED);
    consultation.setSummary("예약금 입금이 확인되어 예약이 확정됐어요. 방문 전 최종 안내만 남았습니다.");
    consultation.setUpdatedAt(message.getCreatedAt());
    consultation.setUnreadCount(0);
    consultation.setBookingStatus(ConsultationBookingStatus.CONFIRMED);
    consultation.setSelectedBooking(selection);
  }

  private ConsultationScheduleOption toScheduleOption(ConsultationScheduleOptionRequest option) {
    return new ConsultationScheduleOption(option.date(), option.time().trim());
  }

  private void markConsultationAsReadForPartner(Consultation consultation) {
    if (consultation.getUnreadCount() != null && consultation.getUnreadCount() > 0) {
      consultation.setUnreadCount(0);
    }
  }

  private String createAccountNumber(Long postId, Integer deposit) {
    long seed = Math.abs((postId * 137L) + (deposit == null ? 0 : deposit));
    return "110-2482-" + String.format("%04d", seed % 10000);
  }

  private ConsultationResponse toResponse(Consultation consultation) {
    List<ConsultationMessageResponse> messages =
        consultationMessageRepository.findByConsultationIdOrderByCreatedAtAsc(consultation.getId()).stream()
            .map(this::toMessageResponse)
            .toList();

    return new ConsultationResponse(
        consultation.getPost().getId(),
        consultation.getCustomer().getName(),
        consultation.getCustomerNote(),
        consultation.getStatusLabel(),
        consultation.getStatusTone().name().toLowerCase(),
        consultation.getSummary(),
        consultation.getUnreadCount(),
        consultation.getUpdatedAt().toString(),
        new ConsultationBookingFlowResponse(
            consultation.getBookingStatus().name().toLowerCase().replace('_', '-'),
            consultation.getDesiredScheduleCount(),
            toBookingSelectionResponse(consultation.getSelectedBooking())),
        messages);
  }

  private ConsultationMessageResponse toMessageResponse(ConsultationMessage message) {
    List<ConsultationScheduleOptionResponse> desiredScheduleOptions =
        message.getDesiredScheduleOptions().isEmpty()
            ? null
            : message.getDesiredScheduleOptions().stream()
                .map(option -> new ConsultationScheduleOptionResponse(option.getDate().toString(), option.getTime()))
                .toList();

    return new ConsultationMessageResponse(
        message.getMessageKey(),
        message.getSenderRole().name().toLowerCase(),
        message.getType().name().toLowerCase().replace('_', '-'),
        message.getContent(),
        message.getCreatedAt().toString(),
        message.getImageUrl(),
        desiredScheduleOptions,
        toBookingSelectionResponse(message.getBookingData()));
  }

  private void validateImageFile(MultipartFile file) {
    if (file == null || file.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
    }

    String contentType = file.getContentType();

    if (contentType == null || !contentType.startsWith("image/")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only image upload is supported");
    }
  }

  private ConsultationBookingSelectionResponse toBookingSelectionResponse(
      ConsultationBookingSelection selection) {
    if (selection == null) {
      return null;
    }

    return new ConsultationBookingSelectionResponse(
        selection.getDate().toString(),
        selection.getTime(),
        selection.getDeposit(),
        selection.getBankName(),
        selection.getAccountNumber(),
        selection.getAccountHolder());
  }
}
