package com.winwin.backend.consultation;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationMessageRepository extends JpaRepository<ConsultationMessage, Long> {

  @EntityGraph(attributePaths = {"desiredScheduleOptions"})
  List<ConsultationMessage> findByConsultationIdOrderByCreatedAtAsc(Long consultationId);
}
