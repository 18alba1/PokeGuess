package com.pokeguess.backend.service;

import com.pokeguess.backend.model.Direction;
import com.pokeguess.backend.model.GuessResult;
import com.pokeguess.backend.model.MatchStatus;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
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

        // Compare Pokémon types.
        result.setType(
                compareTypes(
                        target.getTypes(),
                        guess.getTypes()
                )
        );

        // Compare generation, handling missing values.
        result.setGeneration(
                compareKnownAttribute(
                        target.getGeneration(),
                        guess.getGeneration()
                )
        );

        // Compare habitat, handling missing values.
        result.setHabitat(
                compareKnownAttribute(
                        target.getHabitat(),
                        guess.getHabitat()
                )
        );

        // Compare physical attributes.
        result.setHeight(
                compareNumber(
                        target.getHeight(),
                        guess.getHeight()
                )
        );

        result.setWeight(
                compareNumber(
                        target.getWeight(),
                        guess.getWeight()
                )
        );

        // Calculate evolution distance.
        Integer evolutionDistance =
                evolutionService.getEvolutionDistance(
                        target,
                        guess
                );

        result.setEvolutionDistance(evolutionDistance);

        // Check whether the guess is correct.
        result.setCorrect(
                target.getName() != null
                        && target.getName().equalsIgnoreCase(
                                guess.getName()
                        )
        );

        return result;
    }

    private MatchStatus compareTypes(
            List<String> targetTypeList,
            List<String> guessTypeList) {

        Set<String> targetTypes =
                normalizeTypes(targetTypeList);

        Set<String> guessTypes =
                normalizeTypes(guessTypeList);

        // Missing type information should not be treated
        // as an incorrect match.
        if (targetTypes.isEmpty() || guessTypes.isEmpty()) {
            return MatchStatus.UNKNOWN;
        }

        Set<String> commonTypes =
                new HashSet<>(targetTypes);

        commonTypes.retainAll(guessTypes);

        // All target types are present in the guess.
        if (commonTypes.containsAll(targetTypes)) {
            return MatchStatus.MATCH;
        }

        // At least one type matches.
        if (!commonTypes.isEmpty()) {
            return MatchStatus.CLOSE;
        }

        // No types match.
        return MatchStatus.NO_MATCH;
    }

    private Set<String> normalizeTypes(List<String> types) {
        Set<String> normalizedTypes = new HashSet<>();

        if (types == null) {
            return normalizedTypes;
        }

        for (String type : types) {
            if (type != null && !type.isBlank()) {
                normalizedTypes.add(
                        type.trim().toLowerCase(Locale.ROOT)
                );
            }
        }

        return normalizedTypes;
    }

    private MatchStatus compareKnownAttribute(
            String targetValue,
            String guessValue) {

        // If either value is missing, the comparison
        // cannot be made reliably.
        if (!isKnown(targetValue) || !isKnown(guessValue)) {
            return MatchStatus.UNKNOWN;
        }

        if (targetValue.equalsIgnoreCase(guessValue)) {
            return MatchStatus.MATCH;
        }

        return MatchStatus.NO_MATCH;
    }

    private boolean isKnown(String value) {
        return value != null
                && !value.isBlank()
                && !value.equalsIgnoreCase("unknown");
    }

    private Direction compareNumber(
            double target,
            double guess) {

        if (target > guess) {
            return Direction.UP;
        }

        if (target < guess) {
            return Direction.DOWN;
        }

        return Direction.MATCH;
    }
}