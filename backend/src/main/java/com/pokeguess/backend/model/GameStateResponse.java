package com.pokeguess.backend.model;

import java.util.ArrayList;
import java.util.List;

public class GameStateResponse {

    private int attempts;
    private int maxAttempts;
    private int remainingAttempts;
    private boolean won;
    private boolean gameOver;
    private String target;
    private List<GuessResult> guesses = new ArrayList<>();

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public int getRemainingAttempts() {
        return remainingAttempts;
    }

    public void setRemainingAttempts(int remainingAttempts) {
        this.remainingAttempts = remainingAttempts;
    }

    public boolean isWon() {
        return won;
    }

    public void setWon(boolean won) {
        this.won = won;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public List<GuessResult> getGuesses() {
        return guesses;
    }

    public void setGuesses(List<GuessResult> guesses) {
        this.guesses = guesses;
    }
}