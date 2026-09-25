package com.pokeguess.backend.model;

import java.util.ArrayList;
import java.util.List;

public class GameState {

    private static final int MAX_ATTEMPTS = 10;

    private final Pokemon target;
    private final List<Pokemon> guesses = new ArrayList<>();
    private boolean won;

    public GameState(Pokemon target) {
        this.target = target;
    }

    public Pokemon getTarget() {
        return target;
    }

    public List<Pokemon> getGuesses() {
        return guesses;
    }

    public void addGuess(Pokemon guess) {
        guesses.add(guess);
    }

    public int getAttempts() {
        return guesses.size();
    }

    public int getRemainingAttempts() {
        return MAX_ATTEMPTS - getAttempts();
    }

    public int getMaxAttempts() {
        return MAX_ATTEMPTS;
    }

    public boolean isWon() {
        return won;
    }

    public void setWon(boolean won) {
        this.won = won;
    }

    public boolean isGameOver() {
        return won || getAttempts() >= MAX_ATTEMPTS;
    }
}