package com.example.smartdine;

import java.util.List;

public class RecommendationResponse {
    private String query;
    private Restaurant bestMatch;
    private List<Restaurant> alternatives;
    private String explanation;

    public RecommendationResponse() {
    }

    public RecommendationResponse(String query, Restaurant bestMatch, List<Restaurant> alternatives, String explanation) {
        this.query = query;
        this.bestMatch = bestMatch;
        this.alternatives = alternatives;
        this.explanation = explanation;
    }

    public String getQuery() {
        return query;
    }

    public Restaurant getBestMatch() {
        return bestMatch;
    }

    public List<Restaurant> getAlternatives() {
        return alternatives;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public void setBestMatch(Restaurant bestMatch) {
        this.bestMatch = bestMatch;
    }

    public void setAlternatives(List<Restaurant> alternatives) {
        this.alternatives = alternatives;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
