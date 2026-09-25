package com.pokeguess.backend.service;

import com.pokeguess.backend.model.GameState;
import com.pokeguess.backend.model.GameStateResponse;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;

@Service
public class GameService {

    private final PokemonService pokemonService;
    private final ClueService clueService;

    private GameState currentGame;

    public GameService(
            PokemonService pokemonService,
            ClueService clueService) {

        this.pokemonService = pokemonService;
        this.clueService = clueService;
    }

    public GameStateResponse startGame() {

        Pokemon target = pokemonService.getPokemon("pikachu");

        currentGame = new GameState(target);

        return createStateResponse();
    }

    public GameStateResponse getGameState() {

        if (currentGame == null) {
            throw new IllegalStateException("No game has been started.");
        }

        return createStateResponse();
    }

    public GuessResult makeGuess(String pokemonName) {

        if (currentGame == null) {
            throw new IllegalStateException("No game has been started.");
        }

        if (currentGame.isGameOver()) {
            throw new IllegalStateException("The game is already over.");
        }

        Pokemon guess = pokemonService.getPokemon(pokemonName);

        GuessResult result =
                clueService.compare(currentGame.getTarget(), guess);

        currentGame.addGuess(guess);

        if (result.isCorrect()) {
            currentGame.setWon(true);
        }

        return result;
    }

    private GameStateResponse createStateResponse() {

        GameStateResponse response = new GameStateResponse();

        response.setAttempts(currentGame.getAttempts());
        response.setMaxAttempts(currentGame.getMaxAttempts());
        response.setRemainingAttempts(
                currentGame.getRemainingAttempts()
        );
        response.setWon(currentGame.isWon());
        response.setGameOver(currentGame.isGameOver());

        if (currentGame.isGameOver()) {
            response.setTarget(currentGame.getTarget().getName());
        }

        return response;
    }
}