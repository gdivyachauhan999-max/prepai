package com.prepai.backend.repository;

import com.prepai.backend.model.Interview;
import com.prepai.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByInterviewOrderByOrderIndexAsc(Interview interview);
    Optional<Question> findByInterviewAndOrderIndex(Interview interview, Integer orderIndex);
    long countByInterview(Interview interview);
}