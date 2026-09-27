package com.pokeguess.backend.repository;

import com.pokeguess.backend.entity.Guess;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GuessRepository extends JpaRepository<Guess, UUID> {

    List<Guess> findByGameSessionIdOrderByAttemptNumberAsc(UUID gameSessionId);
}