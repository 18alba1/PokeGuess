package com.pokeguess.backend.service;

import com.pokeguess.backend.entity.DailyChallenge;
import com.pokeguess.backend.entity.GameSession;
import com.pokeguess.backend.entity.Guess;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.repository.GameSessionRepository;
import com.pokeguess.backend.repository.GuessRepository;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class GameServiceTest {

    private final PokemonService pokemonService =
            mock(PokemonService.class);

    private final ClueService clueService =
            mock(ClueService.class);

    private final DailyChallengeService dailyChallengeService =
            mock(DailyChallengeService.class);

    private final GameSessionRepository gameSessionRepository =
            mock(GameSessionRepository.class);

    private final GuessRepository guessRepository =
            mock(GuessRepository.class);

    private final GameService gameService = new GameService(
            pokemonService,
            clueService,
            dailyChallengeService,
            gameSessionRepository,
            guessRepository
    );

    @Test
    void shouldCreateGameSession() {

        DailyChallenge challenge = createDailyChallenge();

        when(dailyChallengeService.getTodaysChallenge())
                .thenReturn(challenge);

        UUID sessionId = gameService.startGame();

        assertNotNull(sessionId);

        verify(dailyChallengeService)
                .getTodaysChallenge();

        verify(gameSessionRepository)
                .save(any(GameSession.class));
    }

    @Test
    void shouldSaveGuessAndIncreaseAttempts() {

        UUID sessionId = UUID.randomUUID();

        DailyChallenge challenge = createDailyChallenge();

        GameSession session = createGameSession(
                sessionId,
                challenge,
                0,
                false
        );

        Pokemon target = createPokemon(
                "pikachu",
                0.4,
                6.0,
                "electric",
                "generation-i",
                "forest"
        );

        Pokemon guess = createPokemon(
                "charizard",
                1.7,
                90.5,
                "fire",
                "generation-i",
                "mountain"
        );

        GuessResult expectedResult = new GuessResult();
        expectedResult.setPokemon(guess);
        expectedResult.setCorrect(false);

        when(gameSessionRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        when(pokemonService.getPokemon("25"))
                .thenReturn(target);

        when(pokemonService.getPokemon("charizard"))
                .thenReturn(guess);

        when(clueService.compare(target, guess))
                .thenReturn(expectedResult);

        GuessResult actualResult =
                gameService.makeGuess(sessionId, "charizard");

        assertSame(expectedResult, actualResult);

        assertEquals(1, session.getAttempts());

        assertFalse(session.isWon());

        verify(gameSessionRepository)
                .findById(sessionId);

        verify(pokemonService)
                .getPokemon("25");

        verify(pokemonService)
                .getPokemon("charizard");

        verify(clueService)
                .compare(target, guess);

        verify(guessRepository)
                .save(any(Guess.class));

        verify(gameSessionRepository)
                .save(session);
    }

    @Test
    void shouldEndGameWhenGuessIsCorrect() {

        UUID sessionId = UUID.randomUUID();

        DailyChallenge challenge = createDailyChallenge();

        GameSession session = createGameSession(
                sessionId,
                challenge,
                0,
                false
        );

        Pokemon target = createPokemon(
                "pikachu",
                0.4,
                6.0,
                "electric",
                "generation-i",
                "forest"
        );

        GuessResult expectedResult = new GuessResult();
        expectedResult.setPokemon(target);
        expectedResult.setCorrect(true);

        when(gameSessionRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        when(pokemonService.getPokemon("25"))
                .thenReturn(target);

        when(pokemonService.getPokemon("pikachu"))
                .thenReturn(target);

        when(clueService.compare(target, target))
                .thenReturn(expectedResult);

        GuessResult actualResult =
                gameService.makeGuess(sessionId, "pikachu");

        assertSame(expectedResult, actualResult);

        assertEquals(1, session.getAttempts());

        assertTrue(session.isWon());

        assertNotNull(session.getCompletedAt());

        verify(guessRepository)
                .save(any(Guess.class));

        verify(gameSessionRepository)
                .save(session);
    }

    @Test
    void shouldEndGameAfterTenIncorrectGuesses() {

        UUID sessionId = UUID.randomUUID();

        DailyChallenge challenge = createDailyChallenge();

        GameSession session = createGameSession(
                sessionId,
                challenge,
                9,
                false
        );

        Pokemon target = createPokemon(
                "pikachu",
                0.4,
                6.0,
                "electric",
                "generation-i",
                "forest"
        );

        Pokemon guess = createPokemon(
                "charizard",
                1.7,
                90.5,
                "fire",
                "generation-i",
                "mountain"
        );

        GuessResult result = new GuessResult();
        result.setPokemon(guess);
        result.setCorrect(false);

        when(gameSessionRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        when(pokemonService.getPokemon("25"))
                .thenReturn(target);

        when(pokemonService.getPokemon("charizard"))
                .thenReturn(guess);

        when(clueService.compare(target, guess))
                .thenReturn(result);

        gameService.makeGuess(sessionId, "charizard");

        assertEquals(10, session.getAttempts());

        assertFalse(session.isWon());

        assertNotNull(session.getCompletedAt());

        verify(guessRepository)
                .save(any(Guess.class));

        verify(gameSessionRepository)
                .save(session);
    }

    @Test
    void shouldRejectEleventhGuess() {

        UUID sessionId = UUID.randomUUID();

        DailyChallenge challenge = createDailyChallenge();

        GameSession session = createGameSession(
                sessionId,
                challenge,
                10,
                false
        );

        when(gameSessionRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        assertThrows(
                IllegalStateException.class,
                () -> gameService.makeGuess(
                        sessionId,
                        "charizard"
                )
        );

        assertEquals(10, session.getAttempts());

        verifyNoInteractions(
                pokemonService,
                clueService,
                guessRepository
        );
    }

    @Test
    void shouldRejectGuessAfterWinning() {

        UUID sessionId = UUID.randomUUID();

        DailyChallenge challenge = createDailyChallenge();

        GameSession session = createGameSession(
                sessionId,
                challenge,
                2,
                true
        );

        when(gameSessionRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        assertThrows(
                IllegalStateException.class,
                () -> gameService.makeGuess(
                        sessionId,
                        "charizard"
                )
        );

        assertEquals(2, session.getAttempts());

        assertTrue(session.isWon());

        verifyNoInteractions(
                pokemonService,
                clueService,
                guessRepository
        );
    }

    private DailyChallenge createDailyChallenge() {

        DailyChallenge challenge = new DailyChallenge();

        challenge.setDate(LocalDate.now());
        challenge.setPokemonId(25);

        return challenge;
    }

    private GameSession createGameSession(
            UUID sessionId,
            DailyChallenge challenge,
            int attempts,
            boolean won
    ) {

        GameSession session = new GameSession();

        session.setId(sessionId);
        session.setDailyChallenge(challenge);
        session.setStartedAt(LocalDateTime.now());
        session.setAttempts(attempts);
        session.setWon(won);

        return session;
    }

    private Pokemon createPokemon(
            String name,
            double height,
            double weight,
            String type,
            String generation,
            String habitat
    ) {

        Pokemon pokemon = new Pokemon();

        pokemon.setName(name);
        pokemon.setHeight(height);
        pokemon.setWeight(weight);
        pokemon.setTypes(List.of(type));
        pokemon.setGeneration(generation);
        pokemon.setHabitat(habitat);

        return pokemon;
    }
}