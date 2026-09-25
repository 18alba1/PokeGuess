package com.pokeguess.backend.service;

import com.pokeguess.backend.client.PokeApiClient;
import com.pokeguess.backend.dto.PokeApiEvolutionChainResponse;
import com.pokeguess.backend.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EvolutionService {

    private final PokeApiClient pokeApiClient;

    public EvolutionService(PokeApiClient pokeApiClient) {
        this.pokeApiClient = pokeApiClient;
    }

    public Integer getEvolutionDistance(Pokemon first, Pokemon second) {

        if (first.getEvolutionChainId() != second.getEvolutionChainId()) {
            return null;
        }

        if (first.getName().equalsIgnoreCase(second.getName())) {
            return 0;
        }

        PokeApiEvolutionChainResponse response =
                pokeApiClient.getEvolutionChain(first.getEvolutionChainId());

        Map<String, Set<String>> graph = new HashMap<>();

        buildGraph(response.getChain(), graph);

        return findDistance(
                first.getName().toLowerCase(),
                second.getName().toLowerCase(),
                graph
        );
    }

    private void buildGraph(
            PokeApiEvolutionChainResponse.ChainLink current,
            Map<String, Set<String>> graph
    ) {
        String currentName = current.getSpecies().getName().toLowerCase();

        graph.putIfAbsent(currentName, new HashSet<>());

        for (PokeApiEvolutionChainResponse.ChainLink next : current.getEvolvesTo()) {

            String nextName = next.getSpecies().getName().toLowerCase();

            graph.putIfAbsent(nextName, new HashSet<>());

            graph.get(currentName).add(nextName);
            graph.get(nextName).add(currentName);

            buildGraph(next, graph);
        }
    }

    private Integer findDistance(
            String start,
            String target,
            Map<String, Set<String>> graph
    ) {
        Queue<String> queue = new LinkedList<>();
        Map<String, Integer> distances = new HashMap<>();

        queue.add(start);
        distances.put(start, 0);

        while (!queue.isEmpty()) {

            String current = queue.poll();

            if (current.equals(target)) {
                return distances.get(current);
            }

            for (String neighbour : graph.getOrDefault(current, Set.of())) {

                if (!distances.containsKey(neighbour)) {

                    distances.put(
                            neighbour,
                            distances.get(current) + 1
                    );

                    queue.add(neighbour);
                }
            }
        }

        return null;
    }
}