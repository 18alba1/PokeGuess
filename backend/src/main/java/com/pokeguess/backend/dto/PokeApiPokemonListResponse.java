package com.pokeguess.backend.dto;

import java.util.List;

public class PokeApiPokemonListResponse {

    private int count;
    private List<PokemonListEntry> results;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<PokemonListEntry> getResults() {
        return results;
    }

    public void setResults(List<PokemonListEntry> results) {
        this.results = results;
    }

    public static class PokemonListEntry {

        private String name;
        private String url;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }
    }
}