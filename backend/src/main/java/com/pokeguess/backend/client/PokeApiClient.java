package com.pokeguess.backend.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class PokeApiClient {

    private final RestClient restClient;

    public PokeApiClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://pokeapi.co/api/v2")
                .build();
    }

    public String getPokemon(String name) {
        return restClient.get()
                .uri("/pokemon/{name}", name)
                .retrieve()
                .body(String.class);
    }
}