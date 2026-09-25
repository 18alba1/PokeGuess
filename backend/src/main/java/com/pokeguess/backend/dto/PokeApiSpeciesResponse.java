package com.pokeguess.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PokeApiSpeciesResponse {

    private NamedResource generation;
    private NamedResource habitat;

    @JsonProperty("evolution_chain")
    private NamedResource evolutionChain;

    public NamedResource getGeneration() {
        return generation;
    }

    public void setGeneration(NamedResource generation) {
        this.generation = generation;
    }

    public NamedResource getHabitat() {
        return habitat;
    }

    public void setHabitat(NamedResource habitat) {
        this.habitat = habitat;
    }

    public NamedResource getEvolutionChain() {
        return evolutionChain;
    }

    public void setEvolutionChain(NamedResource evolutionChain) {
        this.evolutionChain = evolutionChain;
    }

    public static class NamedResource {

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