package com.example.smartdine;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class RecommendationService {

    private final RestaurantRepository restaurantRepository;
    private final RestaurantTagRepository tagRepository;   
    private final Random random = new Random();

    public RecommendationService(RestaurantRepository restaurantRepository,
                                 RestaurantTagRepository tagRepository) {
        this.restaurantRepository = restaurantRepository;
        this.tagRepository = tagRepository;
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Restaurant getRestaurantById(long id) {
        return restaurantRepository.findById(id).orElse(null);
    }

    
    public RecommendationResponse recommend(String query) {
        if (query == null) query = "";
        String q = query.toLowerCase(Locale.ROOT).trim();

        List<Restaurant> all = restaurantRepository.findAll();
        if (all.isEmpty()) {
            return new RecommendationResponse(query, null, List.of(),
                    "There are no restaurants configured yet. Please insert some data first.");
        }

        
        List<RestaurantTag> allTags = tagRepository.findAll();
        Set<String> matchedTags = allTags.stream()
                .map(t -> t.getTag().toLowerCase())
                .filter(q::contains) 
                .collect(Collectors.toSet());

        
        if (!matchedTags.isEmpty()) {

            
            Map<Long, Integer> matchScore = new HashMap<>();
            for (String tag : matchedTags) {
                allTags.stream()
                        .filter(t -> t.getTag().equalsIgnoreCase(tag))
                        .forEach(t -> matchScore.merge(t.getRestaurantId(), 1, Integer::sum));
            }

            
            List<Restaurant> sorted = all.stream()
                    .filter(r -> matchScore.containsKey(r.getId()))
                    .sorted((a, b) -> {
                        int tagCompare = matchScore.get(b.getId()) - matchScore.get(a.getId());
                        if (tagCompare != 0) return tagCompare;
                        return Double.compare(b.getRating(), a.getRating());
                    })
                    .toList();

            if (!sorted.isEmpty()) {
                Restaurant best = sorted.get(0);
                List<Restaurant> alternatives = sorted.stream().skip(1).limit(4).toList();
                String explanation = "Matched using tags: " + String.join(", ", matchedTags);
                return new RecommendationResponse(query, best, alternatives, explanation);
            }
        }

        
        return fallbackRecommend(query, all);
    }

    private RecommendationResponse fallbackRecommend(String query, List<Restaurant> all) {
        String q = query.toLowerCase(Locale.ROOT);

        List<RestaurantScore> scored = new ArrayList<>();
        for (Restaurant r : all) {
            int score = scoreRestaurant(r, q);
            scored.add(new RestaurantScore(r, score));
        }

        scored.sort(Comparator.comparingInt(RestaurantScore::score).reversed());

        Restaurant best = scored.get(0).restaurant();
        List<Restaurant> alternatives = scored.stream().skip(1).limit(4)
                .map(RestaurantScore::restaurant).toList();

        String explanation = buildExplanation(best, q);
        return new RecommendationResponse(query, best, alternatives, explanation);
    }

    public RecommendationResponse surprise() {
        List<Restaurant> all = restaurantRepository.findAll();
        if (all.isEmpty()) {
            return new RecommendationResponse("surprise me", null, List.of(),
                    "There are no restaurants configured yet. Please insert some data first.");
        }
        Restaurant pick = all.get(random.nextInt(all.size()));
        String explanation = "This is a random pick from your nearby options. Sometimes surprise food tastes the best.";
        return new RecommendationResponse("surprise me", pick, List.of(), explanation);
    }

    
    private int scoreRestaurant(Restaurant r, String q) {
        int score = 0;

        String price = r.getPriceRange() == null ? "" : r.getPriceRange().toLowerCase(Locale.ROOT);
        String tags = r.getTags() == null ? "" : r.getTags().toLowerCase(Locale.ROOT);
        String cuisine = r.getCuisine() == null ? "" : r.getCuisine().toLowerCase(Locale.ROOT);

        if (q.contains("cheap") || q.contains("budget") || q.contains("low")) {
            if (price.contains("cheap")) score += 3;
        }
        if (q.contains("expensive") || q.contains("fancy") || q.contains("treat")) {
            if (price.contains("expensive")) score += 3;
        }
        if (q.contains("medium") || q.contains("normal")) {
            if (price.contains("medium")) score += 2;
        }

        String[] keywords = {"spicy", "cheesy", "comfort", "sweet", "biryani", "pizza", "healthy", "dessert", "snacks"};
        for (String kw : keywords) {
            if (q.contains(kw) && (tags.contains(kw) || cuisine.contains(kw))) {
                score += 2;
            }
        }

        if (q.contains("north indian") && cuisine.contains("north indian")) score += 2;
        if (q.contains("south indian") && cuisine.contains("south indian")) score += 2;
        if (q.contains("italian") && cuisine.contains("italian")) score += 2;

        score += (int) Math.round(r.getRating());
        return score;
    }

    private String buildExplanation(Restaurant best, String q) {
        if (best == null) {
            return "I could not find anything that matches well. Maybe try describing your craving in a different way.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("Try ").append(best.getName()).append(" because ");

        String price = best.getPriceRange() == null ? "" : best.getPriceRange().toLowerCase(Locale.ROOT);
        String tags = best.getTags() == null ? "" : best.getTags().toLowerCase(Locale.ROOT);

        if (price.contains("cheap") && (q.contains("cheap") || q.contains("budget"))) {
            sb.append("it fits a student budget and ");
        } else if (price.contains("expensive") && (q.contains("treat") || q.contains("fancy"))) {
            sb.append("it works well for a special treat and ");
        }

        if (tags.contains("spicy") && q.contains("spicy")) sb.append("their spicy items are quite popular, ");
        if (tags.contains("cheesy") && q.contains("cheesy")) sb.append("they are known for cheesy dishes, ");
        if (tags.contains("comfort") || q.contains("comfort")) sb.append("it feels like comfort food after a long day, ");

        sb.append("and it usually has good reviews from students around ");
        sb.append(best.getLocation()).append(".");

        return sb.toString();
    }

    private record RestaurantScore(Restaurant restaurant, int score) {
    }
}
