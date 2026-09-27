package com.pokeguess.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "game_session")
public class GameSession {

    @Id
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "daily_challenge_id")
    private DailyChallenge dailyChallenge;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime completedAt;

    @Column(nullable = false)
    private boolean won;

    @Column(nullable = false)
    private int attempts;

    public GameSession() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DailyChallenge getDailyChallenge() {
        return dailyChallenge;
    }

    public void setDailyChallenge(DailyChallenge dailyChallenge) {
        this.dailyChallenge = dailyChallenge;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public boolean isWon() {
        return won;
    }

    public void setWon(boolean won) {
        this.won = won;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }
}