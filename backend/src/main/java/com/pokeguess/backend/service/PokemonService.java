package com.pokeguess.backend.service;

import com.pokeguess.backend.client.PokeApiClient;
import com.pokeguess.backend.dto.PokeApiPokemonResponse;
import com.pokeguess.backend.dto.PokeApiSpeciesResponse;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;
import com.pokeguess.backend.dto.PokeApiPokemonListResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class PokemonService {

    private final PokeApiClient pokeApiClient;

    public PokemonService(PokeApiClient pokeApiClient) {
        this.pokeApiClient = pokeApiClient;
    }
    
    private int extractEvolutionChainId(String url) {
        String[] parts = url.split("/");
        return Integer.parseInt(parts[parts.length - 1]);
    }
    
    public Pokemon getPokemon(String name) {
        PokeApiPokemonResponse pokemonResponse =
                pokeApiClient.getPokemon(name);

        PokeApiSpeciesResponse speciesResponse =
                pokeApiClient.getSpecies(name);

        Pokemon pokemon = new Pokemon();

        double heightInMeters = pokemonResponse.getHeight() / 10;
        double weightInKg = pokemonResponse.getWeight() / 10;

        pokemon.setName(pokemonResponse.getName());
        pokemon.setHeight(heightInMeters);
        pokemon.setWeight(weightInKg);

        List<String> types = new ArrayList<>();

        for (PokeApiPokemonResponse.TypeSlot typeSlot : pokemonResponse.getTypes()) {
            types.add(typeSlot.getType().getName());
        }

        pokemon.setTypes(types);

        pokemon.setGeneration(speciesResponse.getGeneration().getName());
        pokemon.setHabitat(speciesResponse.getHabitat().getName());

        pokemon.setGeneration(speciesResponse.getGeneration().getName());
        pokemon.setHabitat(speciesResponse.getHabitat().getName());

        int evolutionChainId = extractEvolutionChainId(speciesResponse.getEvolutionChain().getUrl());
        pokemon.setEvolutionChainId(evolutionChainId);

        return pokemon;
    }

    public PokeApiPokemonListResponse getPokemonList() {
        return pokeApiClient.getPokemonList();
    }
}