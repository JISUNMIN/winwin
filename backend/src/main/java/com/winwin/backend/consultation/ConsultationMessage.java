package com.winwin.backend.consultation;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "consultation_messages")
public class ConsultationMessage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "consultation_id", nullable = false)
  private Consultation consultation;

  @Column(name = "message_key", nullable = false, length = 40)
  private String messageKey;

  @Enumerated(EnumType.STRING)
  @Column(name = "sender_role", nullable = false, length = 20)
  private ConsultationSenderRole senderRole;

  @Enumerated(EnumType.STRING)
  @Column(name = "message_type", nullable = false, length = 40)
  private ConsultationMessageType type;

  @Column(nullable = false, length = 500)
  private String content;

  @Column(name = "image_url", length = 500)
  private String imageUrl;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @ElementCollection
  @CollectionTable(
      name = "consultation_message_schedule_options",
      joinColumns = @JoinColumn(name = "message_id"))
  @OrderColumn(name = "display_order")
  private List<ConsultationScheduleOption> desiredScheduleOptions = new ArrayList<>();

  @Embedded
  private ConsultationBookingSelection bookingData;

  public Long getId() {
    return id;
  }

  public Consultation getConsultation() {
    return consultation;
  }

  public void setConsultation(Consultation consultation) {
    this.consultation = consultation;
  }

  public String getMessageKey() {
    return messageKey;
  }

  public void setMessageKey(String messageKey) {
    this.messageKey = messageKey;
  }

  public ConsultationSenderRole getSenderRole() {
    return senderRole;
  }

  public void setSenderRole(ConsultationSenderRole senderRole) {
    this.senderRole = senderRole;
  }

  public ConsultationMessageType getType() {
    return type;
  }

  public void setType(ConsultationMessageType type) {
    this.type = type;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public String getImageUrl() {
    return imageUrl;
  }

  public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl;
  }

  public List<ConsultationScheduleOption> getDesiredScheduleOptions() {
    return desiredScheduleOptions;
  }

  public void setDesiredScheduleOptions(List<ConsultationScheduleOption> desiredScheduleOptions) {
    this.desiredScheduleOptions = new ArrayList<>(desiredScheduleOptions);
  }

  public ConsultationBookingSelection getBookingData() {
    return bookingData;
  }

  public void setBookingData(ConsultationBookingSelection bookingData) {
    this.bookingData = bookingData;
  }
}
