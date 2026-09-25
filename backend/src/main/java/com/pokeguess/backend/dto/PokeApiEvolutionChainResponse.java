package com.pokeguess.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class PokeApiEvolutionChainResponse {

    private ChainLink chain;

    public ChainLink getChain() {
        return chain;
    }

    public void setChain(ChainLink chain) {
        this.chain = chain;
    }

    public static class ChainLink {

        private PokeApiSpeciesResponse.NamedResource species;

        @JsonProperty("evolves_to")
        private List<ChainLink> evolvesTo;

        public PokeApiSpeciesResponse.NamedResource getSpecies() {
            return species;
        }

        public void setSpecies(PokeApiSpeciesResponse.NamedResource species) {
            this.species = species;
        }

        public List<ChainLink> getEvolvesTo() {
            return evolvesTo;
        }

        public void setEvolvesTo(List<ChainLink> evolvesTo) {
            this.evolvesTo = evolvesTo;
        }
    }
}