package com.pokeguess.backend.service;

import com.pokeguess.backend.model.Direction;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.MatchStatus;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class ClueService {

    private final EvolutionService evolutionService;

    public ClueService(EvolutionService evolutionService) {
        this.evolutionService = evolutionService;
    }

    public GuessResult compare(Pokemon target, Pokemon guess) {

        GuessResult result = new GuessResult();

        result.setPokemon(guess);

        result.setType(compareTypes(target, guess));

        if (target.getGeneration().equalsIgnoreCase(guess.getGeneration())) {
            result.setGeneration(MatchStatus.MATCH);
        } else {
            result.setGeneration(MatchStatus.NO_MATCH);
        }

        if (target.getHabitat().equalsIgnoreCase(guess.getHabitat())) {
            result.setHabitat(MatchStatus.MATCH);
        } else {
            result.setHabitat(MatchStatus.NO_MATCH);
        }

        result.setHeight(
                compareNumber(target.getHeight(), guess.getHeight())
        );

        result.setWeight(
                compareNumber(target.getWeight(), guess.getWeight())
        );

        Integer evolutionDistance =
                evolutionService.getEvolutionDistance(target, guess);

        result.setEvolutionDistance(evolutionDistance);

        result.setCorrect(
                target.getName().equalsIgnoreCase(guess.getName())
        );

        return result;
    }

    private MatchStatus compareTypes(Pokemon target, Pokemon guess) {

        Set<String> targetTypes = new HashSet<>(target.getTypes());
        Set<String> guessTypes = new HashSet<>(guess.getTypes());

        Set<String> commonTypes = new HashSet<>(targetTypes);
        commonTypes.retainAll(guessTypes);

        if (commonTypes.containsAll(targetTypes)) {
            return MatchStatus.MATCH;
        }

        if (!commonTypes.isEmpty()) {
            return MatchStatus.CLOSE;
        }

        return MatchStatus.NO_MATCH;
    }

    private Direction compareNumber(double target, double guess) {

        if (target > guess) {
            return Direction.UP;
        }

        if (target < guess) {
            return Direction.DOWN;
        }

        return Direction.MATCH;
    }
}