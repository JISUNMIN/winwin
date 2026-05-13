package com.winwin.backend.consultation;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class ConsultationBookingSelection {

  @Column(name = "booking_date")
  private LocalDate date;

  @Column(name = "booking_time", length = 20)
  private String time;

  @Column(name = "booking_deposit")
  private Integer deposit;

  protected ConsultationBookingSelection() {}

  public ConsultationBookingSelection(LocalDate date, String time, Integer deposit) {
    this.date = date;
    this.time = time;
    this.deposit = deposit;
  }

  public LocalDate getDate() {
    return date;
  }

  public String getTime() {
    return time;
  }

  public Integer getDeposit() {
    return deposit;
  }
}
