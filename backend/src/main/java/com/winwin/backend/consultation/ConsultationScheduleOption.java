package com.winwin.backend.consultation;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class ConsultationScheduleOption {

  @Column(name = "schedule_date", nullable = false)
  private LocalDate date;

  @Column(name = "schedule_time", nullable = false, length = 20)
  private String time;

  protected ConsultationScheduleOption() {}

  public ConsultationScheduleOption(LocalDate date, String time) {
    this.date = date;
    this.time = time;
  }

  public LocalDate getDate() {
    return date;
  }

  public String getTime() {
    return time;
  }
}
