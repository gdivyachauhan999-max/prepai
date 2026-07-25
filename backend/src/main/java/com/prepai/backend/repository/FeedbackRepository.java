package com.prepai.backend.repository;

import com.prepai.backend.model.Answer;
import com.prepai.backend.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    Optional<Feedback> findByAnswer(Answer answer);
}