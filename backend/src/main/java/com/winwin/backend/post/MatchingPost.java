package com.winwin.backend.post;

import com.winwin.backend.user.UserAccount;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "matching_posts")
public class MatchingPost {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "owner_id", nullable = false)
  private UserAccount owner;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private PostCategory category;

  @Column(name = "shop_name", nullable = false, length = 120)
  private String shopName;

  @Column(nullable = false, length = 160)
  private String location;

  @Column(name = "location_latitude", nullable = false)
  private Double locationLatitude;

  @Column(name = "location_longitude", nullable = false)
  private Double locationLongitude;

  @Column(name = "location_detail", length = 255)
  private String locationDetail;

  @Column(name = "location_detail_latitude")
  private Double locationDetailLatitude;

  @Column(name = "location_detail_longitude")
  private Double locationDetailLongitude;

  @Enumerated(EnumType.STRING)
  @Column(name = "location_visibility", nullable = false, length = 30)
  private PostLocationVisibility locationVisibility;

  @Column(nullable = false, length = 160)
  private String service;

  @ElementCollection
  @CollectionTable(
      name = "matching_post_requirements",
      joinColumns = @JoinColumn(name = "post_id"))
  @Column(name = "requirement", nullable = false, length = 120)
  @OrderColumn(name = "display_order")
  @Fetch(FetchMode.SUBSELECT)
  @BatchSize(size = 50)
  private List<String> requirements = new ArrayList<>();

  @ElementCollection
  @CollectionTable(
      name = "matching_post_available_dates",
      joinColumns = @JoinColumn(name = "post_id"))
  @Column(name = "available_date", nullable = false)
  @OrderColumn(name = "display_order")
  @Fetch(FetchMode.SUBSELECT)
  @BatchSize(size = 50)
  private List<LocalDate> availableDates = new ArrayList<>();

  @Column(nullable = false)
  private Integer deposit;

  @Column(length = 1000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private PostStatus status;

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

  public UserAccount getOwner() {
    return owner;
  }

  public void setOwner(UserAccount owner) {
    this.owner = owner;
  }

  public PostCategory getCategory() {
    return category;
  }

  public void setCategory(PostCategory category) {
    this.category = category;
  }

  public String getShopName() {
    return shopName;
  }

  public void setShopName(String shopName) {
    this.shopName = shopName;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public Double getLocationLatitude() {
    return locationLatitude;
  }

  public void setLocationLatitude(Double locationLatitude) {
    this.locationLatitude = locationLatitude;
  }

  public Double getLocationLongitude() {
    return locationLongitude;
  }

  public void setLocationLongitude(Double locationLongitude) {
    this.locationLongitude = locationLongitude;
  }

  public String getLocationDetail() {
    return locationDetail;
  }

  public void setLocationDetail(String locationDetail) {
    this.locationDetail = locationDetail;
  }

  public Double getLocationDetailLatitude() {
    return locationDetailLatitude;
  }

  public void setLocationDetailLatitude(Double locationDetailLatitude) {
    this.locationDetailLatitude = locationDetailLatitude;
  }

  public Double getLocationDetailLongitude() {
    return locationDetailLongitude;
  }

  public void setLocationDetailLongitude(Double locationDetailLongitude) {
    this.locationDetailLongitude = locationDetailLongitude;
  }

  public PostLocationVisibility getLocationVisibility() {
    return locationVisibility;
  }

  public void setLocationVisibility(PostLocationVisibility locationVisibility) {
    this.locationVisibility = locationVisibility;
  }

  public String getService() {
    return service;
  }

  public void setService(String service) {
    this.service = service;
  }

  public List<String> getRequirements() {
    return requirements;
  }

  public void setRequirements(List<String> requirements) {
    this.requirements = new ArrayList<>(requirements);
  }

  public List<LocalDate> getAvailableDates() {
    return availableDates;
  }

  public void setAvailableDates(List<LocalDate> availableDates) {
    this.availableDates = new ArrayList<>(availableDates);
  }

  public Integer getDeposit() {
    return deposit;
  }

  public void setDeposit(Integer deposit) {
    this.deposit = deposit;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public PostStatus getStatus() {
    return status;
  }

  public void setStatus(PostStatus status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}
