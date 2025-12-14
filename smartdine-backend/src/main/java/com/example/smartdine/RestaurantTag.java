package com.example.smartdine;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "restaurant_tags")
public class RestaurantTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_id")
    private Long restaurantId;

    private String tag;

    public RestaurantTag() {}

    public RestaurantTag(Long restaurantId, String tag) {
        this.restaurantId = restaurantId;
        this.tag = tag;
    }

    public Long getId() { return id; }
    public Long getRestaurantId() { return restaurantId; }
    public String getTag() { return tag; }

    public void setId(Long id) { this.id = id; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
    public void setTag(String tag) { this.tag = tag; }
}
