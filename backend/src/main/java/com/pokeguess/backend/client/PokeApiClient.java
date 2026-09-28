package com.pokeguess.backend.client;

import com.pokeguess.backend.dto.PokeApiPokemonResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import com.pokeguess.backend.dto.PokeApiSpeciesResponse;
import com.pokeguess.backend.dto.PokeApiEvolutionChainResponse;
import com.pokeguess.backend.dto.PokeApiPokemonListResponse;

@Component
public class PokeApiClient {

    private final RestClient restClient;

    public PokeApiClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://pokeapi.co/api/v2")
                .build();
    }

    public PokeApiPokemonResponse getPokemon(String name) {
        return restClient.get()
                .uri("/pokemon/{name}", name)
                .retrieve()
                .body(PokeApiPokemonResponse.class);
    }

    public PokeApiSpeciesResponse getSpecies(String name) {
        return restClient.get()
                .uri("/pokemon-species/{name}", name)
                .retrieve()
                .body(PokeApiSpeciesResponse.class);
    }

    public PokeApiEvolutionChainResponse getEvolutionChain(int id) {
        return restClient.get()
                .uri("/evolution-chain/{id}", id)
                .retrieve()
                .body(PokeApiEvolutionChainResponse.class);
    }

    public PokeApiPokemonListResponse getPokemonList() {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/pokemon")
                        .queryParam("limit", 1025)
                        .build())
                .retrieve()
                .body(PokeApiPokemonListResponse.class);
    }
}