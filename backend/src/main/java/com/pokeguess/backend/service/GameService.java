package com.pokeguess.backend.service;

import com.pokeguess.backend.model.GameStateResponse;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.Pokemon;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.pokeguess.backend.entity.DailyChallenge;
import com.pokeguess.backend.entity.GameSession;
import com.pokeguess.backend.repository.GameSessionRepository;
import com.pokeguess.backend.repository.GuessRepository;
import com.pokeguess.backend.entity.Guess;

@Service
public class GameService {

    private static final int MAX_ATTEMPTS = 10;

    private final PokemonService pokemonService;
    private final ClueService clueService;
    private final DailyChallengeService dailyChallengeService;
    private final GameSessionRepository gameSessionRepository;

    private final GuessRepository guessRepository;

    public GameService(
            PokemonService pokemonService,
            ClueService clueService,
            DailyChallengeService dailyChallengeService,
            GameSessionRepository gameSessionRepository,
            GuessRepository guessRepository) {

        this.pokemonService = pokemonService;
        this.clueService = clueService;
        this.dailyChallengeService = dailyChallengeService;
        this.gameSessionRepository = gameSessionRepository;
        this.guessRepository = guessRepository;
    }

    public UUID startGame() {

        DailyChallenge challenge =
                dailyChallengeService.getTodaysChallenge();

        GameSession session = new GameSession();

        session.setId(UUID.randomUUID());
        session.setDailyChallenge(challenge);
        session.setStartedAt(LocalDateTime.now());
        session.setWon(false);
        session.setAttempts(0);

        gameSessionRepository.save(session);

        return session.getId();
    }

    public GameStateResponse getGameState(UUID sessionId) {

        GameSession session = gameSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new IllegalStateException("Game session not found."));

        return createStateResponse(session);
    }

    public GuessResult makeGuess(UUID sessionId, String pokemonName) {

        GameSession session = gameSessionRepository.findById(sessionId)
                .orElseThrow(() ->
                        new IllegalStateException("Game session not found."));

        if (session.isWon() || session.getAttempts() >= MAX_ATTEMPTS) {
            throw new IllegalStateException("The game is already over.");
        }

        Pokemon target = pokemonService.getPokemon(
                String.valueOf(
                        session.getDailyChallenge().getPokemonId()
                )
        );

        Pokemon guess = pokemonService.getPokemon(pokemonName);

        GuessResult result =
                clueService.compare(target, guess);

        Guess savedGuess = new Guess();

        savedGuess.setId(UUID.randomUUID());
        savedGuess.setGameSession(session);
        savedGuess.setPokemonName(guess.getName());
        savedGuess.setAttemptNumber(session.getAttempts() + 1);
        savedGuess.setCreatedAt(LocalDateTime.now());

        guessRepository.save(savedGuess);

        session.setAttempts(session.getAttempts() + 1);

        if (result.isCorrect()) {
            session.setWon(true);
            session.setCompletedAt(LocalDateTime.now());
        } else if (session.getAttempts() >= MAX_ATTEMPTS) {
            session.setCompletedAt(LocalDateTime.now());
        }

        gameSessionRepository.save(session);

        return result;
    }

    private GameStateResponse createStateResponse(GameSession session) {

        boolean gameOver =
                session.isWon() || session.getAttempts() >= MAX_ATTEMPTS;

        GameStateResponse response = new GameStateResponse();

        response.setAttempts(session.getAttempts());
        response.setMaxAttempts(MAX_ATTEMPTS);
        response.setRemainingAttempts(
                MAX_ATTEMPTS - session.getAttempts()
        );
        response.setWon(session.isWon());
        response.setGameOver(gameOver);

        Pokemon target = pokemonService.getPokemon(
                String.valueOf(
                        session.getDailyChallenge().getPokemonId()
                )
        );

        if (gameOver) {
            response.setTarget(target.getName());
        }

        List<GuessResult> guessResults = new ArrayList<>();

        List<Guess> guesses =
                guessRepository.findByGameSessionIdOrderByAttemptNumberAsc(
                        session.getId()
                );

        for (Guess guessEntity : guesses) {

            Pokemon guessedPokemon =
                    pokemonService.getPokemon(
                            guessEntity.getPokemonName()
                    );

            GuessResult result =
                    clueService.compare(target, guessedPokemon);

            guessResults.add(result);
        }

        response.setGuesses(guessResults);

        return response;
    }
}