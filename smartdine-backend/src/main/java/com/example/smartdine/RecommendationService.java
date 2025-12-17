package com.example.smartdine;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
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
            return new RecommendationResponse(query, null, List.of(), "No data");
        }

        List<RestaurantTag> allTags = tagRepository.findAll();

        boolean priceIntent = hasPriceIntent(q);
        boolean tagIntent = hasTagIntent(q, allTags);

        if (!priceIntent && !tagIntent) {
        return new RecommendationResponse(
        query,
        null,
        List.of(),
        "Sorry, I couldn't find any matching restaurants right now."
        );
    }

    List<Restaurant> filtered = new ArrayList<>(all);


        if (priceIntent && tagIntent) {
            filtered = filterByPrice(filtered, q);
            filtered = filterByTags(filtered, q, allTags);
            if (filtered.isEmpty()) {
                return new RecommendationResponse(
                    query,
                    null,
                    List.of(),
                    "No restaurants match both price and food preference"
                );
            }
        } else if (priceIntent) {
            filtered = filterByPrice(filtered, q);
        } else if (tagIntent) {
            filtered = filterByTags(filtered, q, allTags);
        }

        if (!filtered.isEmpty()) {
            filtered = filtered.stream()
                .sorted(Comparator.comparingDouble(Restaurant::getRating).reversed())
                .toList();

            Restaurant best = filtered.get(0);
            List<Restaurant> alternatives = filtered.stream().skip(1).limit(4).toList();

            return new RecommendationResponse(query, best, alternatives, "Filtered match");
        }

        return new RecommendationResponse(
        query,
        null,
        List.of(),
        "Sorry, I couldn't find any matching restaurants right now."
);


    }

    private List<Restaurant> filterByPrice(List<Restaurant> list, String q) {
        return list.stream().filter(r -> {
            String p = r.getPriceRange() == null ? "" : r.getPriceRange().toLowerCase();
            if (q.contains("cheap") || q.contains("budget") || q.contains("low")) return p.contains("cheap");
            if (q.contains("expensive") || q.contains("fancy") || q.contains("treat")) return p.contains("expensive");
            if (q.contains("medium") || q.contains("normal")) return p.contains("medium");
            return false;
        }).toList();
    }

    private List<Restaurant> filterByTags(List<Restaurant> list, String q, List<RestaurantTag> allTags) {
        Set<Long> matchedIds = allTags.stream()
            .filter(t -> q.contains(t.getTag().toLowerCase()))
            .map(RestaurantTag::getRestaurantId)
            .collect(Collectors.toSet());

        return list.stream()
            .filter(r -> matchedIds.contains(r.getId()))
            .toList();
    }

    private RecommendationResponse fallbackRecommend(String query, List<Restaurant> all) {
        String q = query.toLowerCase(Locale.ROOT);

        List<RestaurantScore> scored = new ArrayList<>();
        for (Restaurant r : all) {
            scored.add(new RestaurantScore(r, scoreRestaurant(r, q)));
        }

        scored.sort(Comparator.comparingInt(RestaurantScore::score).reversed());

        Restaurant best = scored.get(0).restaurant();
        List<Restaurant> alternatives = scored.stream()
            .skip(1)
            .limit(4)
            .map(RestaurantScore::restaurant)
            .toList();

        return new RecommendationResponse(query, best, alternatives, buildExplanation(best, q));
    }

    public RecommendationResponse surprise() {
        List<Restaurant> all = restaurantRepository.findAll();
        if (all.isEmpty()) {
            return new RecommendationResponse("surprise me", null, List.of(), "No data");
        }
        Restaurant pick = all.get(random.nextInt(all.size()));
        return new RecommendationResponse("surprise me", pick, List.of(), "Random pick");
    }

    private int scoreRestaurant(Restaurant r, String q) {
        int score = 0;

        String price = r.getPriceRange() == null ? "" : r.getPriceRange().toLowerCase();
        String tags = r.getTags() == null ? "" : r.getTags().toLowerCase();
        String cuisine = r.getCuisine() == null ? "" : r.getCuisine().toLowerCase();

        if ((q.contains("cheap") || q.contains("budget")) && price.contains("cheap")) score += 3;
        if ((q.contains("expensive") || q.contains("fancy")) && price.contains("expensive")) score += 3;
        if ((q.contains("medium") || q.contains("normal")) && price.contains("medium")) score += 2;

        String[] keywords = {"spicy", "cheesy", "comfort", "sweet", "biryani", "pizza", "healthy", "dessert", "snacks"};
        for (String kw : keywords) {
            if (q.contains(kw) && (tags.contains(kw) || cuisine.contains(kw))) score += 2;
        }

        score += (int) Math.round(r.getRating());
        return score;
    }

    private boolean hasPriceIntent(String q) {
        return q.contains("cheap") || q.contains("budget") || q.contains("low")
            || q.contains("expensive") || q.contains("fancy") || q.contains("treat")
            || q.contains("medium") || q.contains("normal");
    }

    private boolean hasTagIntent(String q, List<RestaurantTag> allTags) {
        return allTags.stream().anyMatch(t -> q.contains(t.getTag().toLowerCase()));
    }

    private String buildExplanation(Restaurant best, String q) {
        if (best == null) return "No match found";
        return "Recommended based on your preferences";
    }

    private record RestaurantScore(Restaurant restaurant, int score) {}
}
