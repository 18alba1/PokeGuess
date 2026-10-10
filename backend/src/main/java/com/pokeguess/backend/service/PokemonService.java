package com.pokeguess.backend.service;

import com.pokeguess.backend.client.PokeApiClient;
import com.pokeguess.backend.dto.PokeApiPokemonListResponse;
import com.pokeguess.backend.dto.PokeApiPokemonResponse;
import com.pokeguess.backend.dto.PokeApiSpeciesResponse;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class PokemonService {

    private final PokeApiClient pokeApiClient;

    private final ConcurrentMap<String, Pokemon> pokemonCache =
            new ConcurrentHashMap<>();

    public PokemonService(PokeApiClient pokeApiClient) {
        this.pokeApiClient = pokeApiClient;
    }

    public Pokemon getPokemon(String identifier) {
        if (identifier == null || identifier.isBlank()) {
            throw new IllegalArgumentException(
                    "Pokémon name or ID must not be empty."
            );
        }

        String requestedKey = normalize(identifier);

        Pokemon cached = pokemonCache.get(requestedKey);

        if (cached != null) {
            return cached;
        }

        Pokemon loaded = loadPokemon(identifier.trim());

        String canonicalKey = normalize(loaded.getName());

        Pokemon existing =
                pokemonCache.putIfAbsent(canonicalKey, loaded);

        Pokemon result = existing == null ? loaded : existing;

        pokemonCache.putIfAbsent(requestedKey, result);

        return result;
    }

    private Pokemon loadPokemon(String identifier) {
        PokeApiPokemonResponse pokemonResponse =
                pokeApiClient.getPokemon(identifier);

        if (pokemonResponse == null) {
            throw new IllegalStateException(
                    "PokéAPI returned no Pokémon data for: " + identifier
            );
        }

        String speciesName = pokemonResponse.getName();

        if (pokemonResponse.getSpecies() != null
                && pokemonResponse.getSpecies().getName() != null) {
            speciesName = pokemonResponse.getSpecies().getName();
        }

        PokeApiSpeciesResponse speciesResponse =
                pokeApiClient.getSpecies(speciesName);

        if (speciesResponse == null) {
            throw new IllegalStateException(
                    "PokéAPI returned no species data for: " + speciesName
            );
        }

        Pokemon pokemon = new Pokemon();

        pokemon.setName(pokemonResponse.getName());

        pokemon.setHeight(pokemonResponse.getHeight() / 10.0);

        pokemon.setWeight(pokemonResponse.getWeight() / 10.0);

        List<String> types = new ArrayList<>();

        if (pokemonResponse.getTypes() != null) {
            for (PokeApiPokemonResponse.TypeSlot typeSlot
                    : pokemonResponse.getTypes()) {

                if (typeSlot.getType() != null
                        && typeSlot.getType().getName() != null) {
                    types.add(typeSlot.getType().getName());
                }
            }
        }

        pokemon.setTypes(types);

        pokemon.setGeneration(
                getResourceName(speciesResponse.getGeneration())
        );

        pokemon.setHabitat(
                getResourceName(speciesResponse.getHabitat())
        );

        String evolutionChainUrl = null;

        if (speciesResponse.getEvolutionChain() != null) {
            evolutionChainUrl =
                    speciesResponse.getEvolutionChain().getUrl();
        }

        pokemon.setEvolutionChainId(
                extractEvolutionChainId(evolutionChainUrl)
        );

        return pokemon;
    }

    private String getResourceName(
            PokeApiSpeciesResponse.NamedResource resource) {

        if (resource == null
                || resource.getName() == null
                || resource.getName().isBlank()) {
            return "unknown";
        }

        return resource.getName();
    }

    private int extractEvolutionChainId(String url) {
        if (url == null || url.isBlank()) {
            return 0;
        }

        String[] parts = url.split("/");

        for (int i = parts.length - 1; i >= 0; i--) {
            if (!parts[i].isBlank()) {
                try {
                    return Integer.parseInt(parts[i]);
                } catch (NumberFormatException e) {
                    return 0;
                }
            }
        }

        return 0;
    }

    private String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    public PokeApiPokemonListResponse getPokemonList() {
        return pokeApiClient.getPokemonList();
    }
}