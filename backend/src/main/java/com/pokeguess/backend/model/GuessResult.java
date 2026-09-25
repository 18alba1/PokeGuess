package com.pokeguess.backend.model;

public class GuessResult {

    private Pokemon pokemon;

    private MatchStatus type;
    private MatchStatus generation;
    private MatchStatus habitat;
    private Integer evolutionDistance;

    private Direction height;
    private Direction weight;
    
    private boolean correct;

    public Pokemon getPokemon() {
        return pokemon;
    }

    public void setPokemon(Pokemon pokemon) {
        this.pokemon = pokemon;
    }

    public MatchStatus getType() {
        return type;
    }

    public void setType(MatchStatus type) {
        this.type = type;
    }

    public MatchStatus getGeneration() {
        return generation;
    }

    public void setGeneration(MatchStatus generation) {
        this.generation = generation;
    }

    public MatchStatus getHabitat() {
        return habitat;
    }

    public void setHabitat(MatchStatus habitat) {
        this.habitat = habitat;
    }

    public Direction getHeight() {
        return height;
    }

    public void setHeight(Direction height) {
        this.height = height;
    }

    public Direction getWeight() {
        return weight;
    }

    public void setWeight(Direction weight) {
        this.weight = weight;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }

    public Integer getEvolutionDistance() {
        return evolutionDistance;
    }

    public void setEvolutionDistance(Integer evolutionDistance) {
        this.evolutionDistance = evolutionDistance;
    }
}