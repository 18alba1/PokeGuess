package com.pokeguess.backend.dto;

import java.util.List;

public class PokeApiPokemonResponse {

    private String name;
    private double height;
    private double weight;
    private List<TypeSlot> types;
    private SpeciesReference species;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public List<TypeSlot> getTypes() {
        return types;
    }

    public void setTypes(List<TypeSlot> types) {
        this.types = types;
    }

    public SpeciesReference getSpecies() {
        return species;
    }

    public void setSpecies(SpeciesReference species) {
        this.species = species;
    }

    public static class TypeSlot {

        private int slot;
        private TypeReference type;

        public int getSlot() {
            return slot;
        }

        public void setSlot(int slot) {
            this.slot = slot;
        }

        public TypeReference getType() {
            return type;
        }

        public void setType(TypeReference type) {
            this.type = type;
        }
    }

    public static class TypeReference {

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

    public static class SpeciesReference {

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