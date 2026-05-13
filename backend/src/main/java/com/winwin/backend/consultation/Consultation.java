package com.winwin.backend.consultation;

import com.winwin.backend.post.MatchingPost;
import com.winwin.backend.user.UserAccount;
import jakarta.persistence.Column;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
public class Consultation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "post_id", nullable = false)
  private MatchingPost post;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "customer_id", nullable = false)
  private UserAccount customer;

  @Column(name = "customer_note", nullable = false, length = 255)
  private String customerNote;

  @Column(name = "status_label", nullable = false, length = 40)
  private String statusLabel;

  @Enumerated(EnumType.STRING)
  @Column(name = "status_tone", nullable = false, length = 20)
  private ConsultationStatusTone statusTone;

  @Column(nullable = false, length = 255)
  private String summary;

  @Column(name = "unread_count", nullable = false)
  private Integer unreadCount;

  @Enumerated(EnumType.STRING)
  @Column(name = "booking_status", nullable = false, length = 40)
  private ConsultationBookingStatus bookingStatus;

  @Column(name = "desired_schedule_count", nullable = false)
  private Integer desiredScheduleCount;

  @Embedded
  private ConsultationBookingSelection selectedBooking;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  void prePersist() {
    var now = LocalDateTime.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  void preUpdate() {
    updatedAt = LocalDateTime.now();
  }

  public Long getId() {
    return id;
  }

  public MatchingPost getPost() {
    return post;
  }

  public void setPost(MatchingPost post) {
    this.post = post;
  }

  public UserAccount getCustomer() {
    return customer;
  }

  public void setCustomer(UserAccount customer) {
    this.customer = customer;
  }

  public String getCustomerNote() {
    return customerNote;
  }

  public void setCustomerNote(String customerNote) {
    this.customerNote = customerNote;
  }

  public String getStatusLabel() {
    return statusLabel;
  }

  public void setStatusLabel(String statusLabel) {
    this.statusLabel = statusLabel;
  }

  public ConsultationStatusTone getStatusTone() {
    return statusTone;
  }

  public void setStatusTone(ConsultationStatusTone statusTone) {
    this.statusTone = statusTone;
  }

  public String getSummary() {
    return summary;
  }

  public void setSummary(String summary) {
    this.summary = summary;
  }

  public Integer getUnreadCount() {
    return unreadCount;
  }

  public void setUnreadCount(Integer unreadCount) {
    this.unreadCount = unreadCount;
  }

  public ConsultationBookingStatus getBookingStatus() {
    return bookingStatus;
  }

  public void setBookingStatus(ConsultationBookingStatus bookingStatus) {
    this.bookingStatus = bookingStatus;
  }

  public Integer getDesiredScheduleCount() {
    return desiredScheduleCount;
  }

  public void setDesiredScheduleCount(Integer desiredScheduleCount) {
    this.desiredScheduleCount = desiredScheduleCount;
  }

  public ConsultationBookingSelection getSelectedBooking() {
    return selectedBooking;
  }

  public void setSelectedBooking(ConsultationBookingSelection selectedBooking) {
    this.selectedBooking = selectedBooking;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
