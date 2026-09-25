package com.pokeguess.backend.controller;

import com.pokeguess.backend.model.GameStateResponse;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.service.GameService;
import org.springframework.web.bind.annotation.*;

import com.pokeguess.backend.service.DailyChallengeService;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;
    private final DailyChallengeService dailyChallengeService;

    public GameController(GameService gameService, DailyChallengeService dailyChallengeService) {
        this.gameService = gameService;
        this.dailyChallengeService = dailyChallengeService;
    }

    @PostMapping("/start")
    public GameStateResponse startGame() {
        return gameService.startGame();
    }

    @GetMapping("/state")
    public GameStateResponse getGameState() {
        return gameService.getGameState();
    }

    @PostMapping("/guess")
    public GuessResult makeGuess(@RequestParam String name) {
        return gameService.makeGuess(name);
    }

    @GetMapping("/today")
    public Pokemon getToday() {
        return dailyChallengeService.getTodaysPokemon();
    }
}