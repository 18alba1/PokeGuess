package com.pokeguess.backend.repository;

import com.pokeguess.backend.entity.DailyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyChallengeRepository
        extends JpaRepository<DailyChallenge, Long> {

    Optional<DailyChallenge> findByDate(LocalDate date);
}