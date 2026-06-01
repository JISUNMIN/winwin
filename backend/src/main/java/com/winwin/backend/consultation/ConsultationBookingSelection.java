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

  @Column(name = "booking_bank_name", length = 40)
  private String bankName;

  @Column(name = "booking_account_number", length = 60)
  private String accountNumber;

  @Column(name = "booking_account_holder", length = 80)
  private String accountHolder;

  protected ConsultationBookingSelection() {}

  public ConsultationBookingSelection(
      LocalDate date,
      String time,
      Integer deposit,
      String bankName,
      String accountNumber,
      String accountHolder) {
    this.date = date;
    this.time = time;
    this.deposit = deposit;
    this.bankName = bankName;
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
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

  public String getBankName() {
    return bankName;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public String getAccountHolder() {
    return accountHolder;
  }
}
