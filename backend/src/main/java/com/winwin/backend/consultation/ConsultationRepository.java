package com.winwin.backend.consultation;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

  @EntityGraph(attributePaths = {"post", "post.owner", "customer"})
  List<Consultation> findByPostOwnerIdOrderByUpdatedAtDesc(Long ownerId);

  @EntityGraph(attributePaths = {"post", "post.owner", "customer"})
  Optional<Consultation> findByPostIdAndPostOwnerId(Long postId, Long ownerId);

  @EntityGraph(attributePaths = {"post", "post.owner", "customer"})
  Optional<Consultation> findByPostIdAndCustomerId(Long postId, Long customerId);

  @EntityGraph(attributePaths = {"post", "post.owner", "customer"})
  List<Consultation> findByCustomerIdOrderByUpdatedAtDesc(Long customerId);
}
