package com.pokeguess.backend.controller;

import com.pokeguess.backend.model.GameStateResponse;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.service.GameService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
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
}