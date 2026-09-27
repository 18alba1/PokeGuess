package com.pokeguess.backend.service;

import com.pokeguess.backend.entity.DailyChallenge;
import com.pokeguess.backend.entity.GameSession;
import com.pokeguess.backend.entity.Guess;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.repository.DailyChallengeRepository;
import com.pokeguess.backend.repository.GameSessionRepository;
import com.pokeguess.backend.repository.GuessRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@Testcontainers
@SpringBootTest
@TestPropertySource(properties = {
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class GameServiceIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer postgres =
            new PostgreSQLContainer("postgres:18");

    @Autowired
    private GameService gameService;

    @Autowired
    private DailyChallengeRepository dailyChallengeRepository;

    @Autowired
    private GameSessionRepository gameSessionRepository;

    @Autowired
    private GuessRepository guessRepository;

    @MockitoBean
    private PokemonService pokemonService;

    @MockitoBean
    private ClueService clueService;

    @BeforeEach
    void cleanDatabase() {
        guessRepository.deleteAll();
        gameSessionRepository.deleteAll();
        dailyChallengeRepository.deleteAll();
    }

    @Test
    void shouldCreateGameSessionInRealDatabase() {

        UUID sessionId = gameService.startGame();

        assertNotNull(sessionId);

        Optional<GameSession> session =
                gameSessionRepository.findById(sessionId);

        assertTrue(session.isPresent());

        GameSession savedSession = session.get();

        assertNotNull(savedSession.getStartedAt());
        assertFalse(savedSession.isWon());
        assertEquals(0, savedSession.getAttempts());

        assertNotNull(savedSession.getDailyChallenge());

        DailyChallenge challenge =
                savedSession.getDailyChallenge();

        assertNotNull(challenge.getDate());
        assertTrue(challenge.getPokemonId() > 0);

        assertEquals(1, dailyChallengeRepository.count());
        assertEquals(1, gameSessionRepository.count());
    }

    @Test
    void shouldPersistGuessAndUpdateGameSession() {

        UUID sessionId = gameService.startGame();

        GameSession session =
                gameSessionRepository.findById(sessionId)
                        .orElseThrow();

        int pokemonId =
                session.getDailyChallenge().getPokemonId();

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

        when(pokemonService.getPokemon(String.valueOf(pokemonId)))
                .thenReturn(target);

        when(pokemonService.getPokemon("charizard"))
                .thenReturn(guess);

        when(clueService.compare(target, guess))
                .thenReturn(result);

        GuessResult returnedResult =
                gameService.makeGuess(sessionId, "charizard");

        assertSame(result, returnedResult);

        GameSession updatedSession =
                gameSessionRepository.findById(sessionId)
                        .orElseThrow();

        assertEquals(1, updatedSession.getAttempts());
        assertFalse(updatedSession.isWon());

        List<Guess> savedGuesses =
                guessRepository
                        .findByGameSessionIdOrderByAttemptNumberAsc(
                                sessionId
                        );

        assertEquals(1, savedGuesses.size());

        Guess savedGuess = savedGuesses.get(0);

        assertEquals("charizard", savedGuess.getPokemonName());
        assertEquals(1, savedGuess.getAttemptNumber());
        assertEquals(sessionId, savedGuess.getGameSession().getId());
        assertNotNull(savedGuess.getCreatedAt());
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