package com.winwin.backend.post;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchingPostRepository extends JpaRepository<MatchingPost, Long> {

  List<MatchingPost> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

  List<MatchingPost> findByStatusOrderByCreatedAtDesc(PostStatus status);

  Optional<MatchingPost> findById(Long id);
}
