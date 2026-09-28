package com.pokeguess.backend.service;

import com.pokeguess.backend.entity.DailyChallenge;
import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.repository.DailyChallengeRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class DailyChallengeService {

    private static final int SUPPORTED_POKEMON_COUNT = 1025;

    private static final ZoneId GAME_ZONE =
            ZoneId.of("Europe/Stockholm");

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

    public DailyChallenge getTodaysChallenge() {

        LocalDate today = LocalDate.now(GAME_ZONE);

        Optional<DailyChallenge> existingChallenge =
                dailyChallengeRepository.findByDate(today);

        if (existingChallenge.isPresent()) {
            return existingChallenge.get();
        }

        int randomPokemonId =
                ThreadLocalRandom.current()
                        .nextInt(1, SUPPORTED_POKEMON_COUNT + 1);

        DailyChallenge challenge = new DailyChallenge();

        challenge.setDate(today);
        challenge.setPokemonId(randomPokemonId);

        try {
            return dailyChallengeRepository.saveAndFlush(challenge);
        } catch (DataIntegrityViolationException e) {
            return dailyChallengeRepository
                    .findByDate(today)
                    .orElseThrow(() ->
                            new IllegalStateException(
                                    "Daily challenge could not be created."
                            )
                    );
        }
    }
}