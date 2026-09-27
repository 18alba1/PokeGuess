package com.pokeguess.backend.service;

import com.pokeguess.backend.entity.DailyChallenge;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.repository.DailyChallengeRepository;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class DailyChallengeService {

    private static final LocalDate START_DATE = LocalDate.of(2026, 1, 1);
    private static final int SUPPORTED_POKEMON_COUNT = 1025;

    private final DailyChallengeRepository dailyChallengeRepository;
    private final PokemonService pokemonService;

    public DailyChallengeService(
            DailyChallengeRepository dailyChallengeRepository,
            PokemonService pokemonService) {

        this.dailyChallengeRepository = dailyChallengeRepository;
        this.pokemonService = pokemonService;
    }

    public Pokemon getTodaysPokemon() {

        DailyChallenge challenge = getTodaysChallenge();

        return pokemonService.getPokemon(
                String.valueOf(challenge.getPokemonId())
        );
    }

    private int calculatePokemonId(LocalDate date) {

        long daysSinceStart =
                ChronoUnit.DAYS.between(START_DATE, date);

        return (int) Math.floorMod(
                daysSinceStart,
                SUPPORTED_POKEMON_COUNT
        ) + 1;
    }

    public DailyChallenge getTodaysChallenge() {

        LocalDate today = LocalDate.now();

        Optional<DailyChallenge> existingChallenge =
                dailyChallengeRepository.findByDate(today);

        if (existingChallenge.isPresent()) {
            return existingChallenge.get();
        }

        int pokemonId = calculatePokemonId(today);

        DailyChallenge challenge = new DailyChallenge();
        challenge.setDate(today);
        challenge.setPokemonId(pokemonId);

        try {
            return dailyChallengeRepository.saveAndFlush(challenge);
        } catch (DataIntegrityViolationException e) {
            return dailyChallengeRepository.findByDate(today)
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Daily challenge could not be created."
                            ));
        }
    }
}