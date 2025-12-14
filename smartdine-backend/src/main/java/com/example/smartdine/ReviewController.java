package com.example.smartdine;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewController {

	@Autowired
	private ReviewRepository reviewRepo;

	@Autowired
	private RestaurantRepository restaurantRepo;

	@PostMapping
	public ResponseEntity<Review> addReview(@RequestBody Review review) {
		Review saved = reviewRepo.save(review);
		updateRestaurantRating(review.getRestaurantId());
		return ResponseEntity.ok(saved);
	}

	@GetMapping("/restaurant/{restaurantId}")
	public List<Review> getReviewsByRestaurant(@PathVariable Long restaurantId) {
		return reviewRepo.findByRestaurantId(restaurantId);
	}

	@GetMapping("/user/{userId}")
	public List<Review> getReviewsByUser(@PathVariable Long userId) {
		return reviewRepo.findByUserId(userId);
	}

	private void updateRestaurantRating(Long restaurantId) {
		restaurantRepo.findById(restaurantId).ifPresent(restaurant -> {
			List<Review> reviews = reviewRepo.findByRestaurantId(restaurantId);
			if (!reviews.isEmpty()) {
				double avgRating = reviews.stream()
					.mapToInt(Review::getRating)
					.average()
					.orElse(0.0);
				restaurant.setRating(Math.round(avgRating * 10.0) / 10.0);
				restaurantRepo.save(restaurant);
			}
		});
	}
}
