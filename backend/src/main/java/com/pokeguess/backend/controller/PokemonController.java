package com.pokeguess.backend.controller;

import com.pokeguess.backend.model.Pokemon;
import com.pokeguess.backend.service.PokemonService;
import org.springframework.web.bind.annotation.*;
import com.pokeguess.backend.dto.PokeApiPokemonListResponse;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping("/{name}")
    public Pokemon getPokemon(@PathVariable String name) {
        return pokemonService.getPokemon(name);
    }

    @GetMapping("/list")
    public PokeApiPokemonListResponse getPokemonList() {
        return pokemonService.getPokemonList();
    }
}