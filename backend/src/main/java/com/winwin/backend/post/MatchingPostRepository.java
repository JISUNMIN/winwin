package com.winwin.backend.post;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingPostRepository extends JpaRepository<MatchingPost, Long> {

  @EntityGraph(attributePaths = {"requirements", "availableDates", "owner"})
  List<MatchingPost> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

  @EntityGraph(attributePaths = {"requirements", "availableDates", "owner"})
  List<MatchingPost> findByStatusOrderByCreatedAtDesc(PostStatus status);

  @EntityGraph(attributePaths = {"requirements", "availableDates", "owner"})
  Optional<MatchingPost> findWithDetailsById(Long id);
}
