package com.pokeguess.backend.model;

import java.util.List;

public class Pokemon {
    private String name;
    private double height;
    private double weight;
    private List<String> types;
    private String generation;
    private String habitat;

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public double getHeight(){
        return height;
    }

    public void setHeight(double height){
        this.height = height;
    }

    public double getWeight(){
        return weight;
    }

    public void setWeight(double weight){
        this.weight = weight;
    }

    public List<String> getTypes(){
        return types;
    }

    public void setTypes(List<String> types){
        this.types = types;
    }

    public String getGeneration(){
        return generation;
    }

    public void setGeneration(String generation){
        this.generation = generation;
    }

    public String getHabitat(){
        return habitat;
    }

    public void setHabitat(String habitat){
        this.habitat = habitat;
    }
}