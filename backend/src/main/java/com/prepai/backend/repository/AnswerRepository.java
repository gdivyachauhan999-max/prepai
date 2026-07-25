package com.prepai.backend.repository;

import com.prepai.backend.model.Answer;
import com.prepai.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    Optional<Answer> findByQuestion(Question question);
}