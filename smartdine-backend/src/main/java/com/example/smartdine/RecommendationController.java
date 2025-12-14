package com.example.smartdine;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    @PostMapping("/recommend")
    public RecommendationResponse recommend(@RequestBody RecommendationRequest request) {
        return service.recommend(request.getQuery());
    }
    @GetMapping("/restaurants/{id}")
public Restaurant getRestaurant(@PathVariable long id) {
    return service.getRestaurantById(id);
}


    @GetMapping("/restaurants")
    public List<Restaurant> getAllRestaurants() {
         return service.getAllRestaurants();
}

    @GetMapping("/surprise")
    public RecommendationResponse surprise() {
        return service.surprise();
    }
}
