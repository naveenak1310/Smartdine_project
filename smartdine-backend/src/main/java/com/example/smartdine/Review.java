package com.example.smartdine;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_id")
    private Long restaurantId;

    @Column(name = "user_id")
    private Long userId;

    private int rating;
    
    @Column(length = 1000)
    private String text;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Review() {
        this.createdAt = LocalDateTime.now();
    }

    public Review(Long restaurantId, Long userId, int rating, String text) {
        this.restaurantId = restaurantId;
        this.userId = userId;
        this.rating = rating;
        this.text = text;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public Long getRestaurantId() { return restaurantId; }
    public Long getUserId() { return userId; }
    public int getRating() { return rating; }
    public String getText() { return text; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setRating(int rating) { this.rating = rating; }
    public void setText(String text) { this.text = text; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
