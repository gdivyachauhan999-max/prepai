package com.prepai.backend.repository;

import com.prepai.backend.model.Interview;
import com.prepai.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserOrderByStartedAtDesc(User user);
    List<Interview> findByUserAndDomainOrderByStartedAtDesc(User user, String domain);
}