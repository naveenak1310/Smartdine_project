package com.example.smartdine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantTagRepository extends JpaRepository<RestaurantTag, Long> {
    List<RestaurantTag> findByRestaurantId(Long restaurantId);
}
