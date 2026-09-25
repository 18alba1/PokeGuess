package com.pokeguess.backend;

import com.pokeguess.backend.model.Direction;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.MatchStatus;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.service.ClueService;
import com.pokeguess.backend.service.EvolutionService;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ClueServiceTest {

    @Test
    void shouldDetectCorrectPokemon() {

        EvolutionService evolutionService = mock(EvolutionService.class);

        when(evolutionService.getEvolutionDistance(any(Pokemon.class), any(Pokemon.class)))
                .thenReturn(0);

        ClueService clueService = new ClueService(evolutionService);

        Pokemon target = createPokemon(
                "pikachu",
                0.4,
                6.0,
                "electric",
                "generation-i",
                "forest"
        );

        Pokemon guess = createPokemon(
                "pikachu",
                0.4,
                6.0,
                "electric",
                "generation-i",
                "forest"
        );

        GuessResult result = clueService.compare(target, guess);

        assertTrue(result.isCorrect());
        assertEquals(MatchStatus.MATCH, result.getType());
        assertEquals(MatchStatus.MATCH, result.getGeneration());
        assertEquals(MatchStatus.MATCH, result.getHabitat());
        assertEquals(Direction.MATCH, result.getHeight());
        assertEquals(Direction.MATCH, result.getWeight());
        assertEquals(0, result.getEvolutionDistance());
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
        pokemon.setTypes(java.util.List.of(type));
        pokemon.setGeneration(generation);
        pokemon.setHabitat(habitat);

        return pokemon;
    }

    @Test
    void shouldDetectHeightAndWeightDirections() {

        EvolutionService evolutionService = mock(EvolutionService.class);

        when(evolutionService.getEvolutionDistance(any(Pokemon.class), any(Pokemon.class)))
                .thenReturn(null);

        ClueService clueService = new ClueService(evolutionService);

        Pokemon target = createPokemon(
                "charizard",
                1.7,
                90.5,
                "fire",
                "generation-i",
                "mountain"
        );

        Pokemon guess = createPokemon(
                "charmander",
                0.6,
                8.5,
                "fire",
                "generation-i",
                "mountain"
        );

        GuessResult result = clueService.compare(target, guess);

        assertEquals(Direction.UP, result.getHeight());
        assertEquals(Direction.UP, result.getWeight());
    }

    @Test
    void shouldDetectPartialTypeMatch() {

        EvolutionService evolutionService = mock(EvolutionService.class);

        when(evolutionService.getEvolutionDistance(any(Pokemon.class), any(Pokemon.class)))
                .thenReturn(null);

        ClueService clueService = new ClueService(evolutionService);

        Pokemon target = new Pokemon();
        target.setName("charizard");
        target.setHeight(1.7);
        target.setWeight(90.5);
        target.setTypes(java.util.List.of("fire", "flying"));
        target.setGeneration("generation-i");
        target.setHabitat("mountain");

        Pokemon guess = new Pokemon();
        guess.setName("charmander");
        guess.setHeight(0.6);
        guess.setWeight(8.5);
        guess.setTypes(java.util.List.of("fire"));
        guess.setGeneration("generation-i");
        guess.setHabitat("mountain");

        GuessResult result = clueService.compare(target, guess);

        assertEquals(MatchStatus.CLOSE, result.getType());
    }
}