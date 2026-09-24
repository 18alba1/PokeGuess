package com.pokeguess.backend.controller;

import com.pokeguess.backend.client.PokeApiClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokeApiClient pokeApiClient;

    public PokemonController(PokeApiClient pokeApiClient) {
        this.pokeApiClient = pokeApiClient;
    }

    @GetMapping("/{name}")
    public String getPokemon(@PathVariable String name) {
        return pokeApiClient.getPokemon(name);
    }
}