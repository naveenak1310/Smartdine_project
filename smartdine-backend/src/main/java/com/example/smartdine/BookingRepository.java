package com.example.smartdine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b JOIN FETCH b.restaurant WHERE b.userId = :userId")
    List<Booking> findByUserId(int userId);
}
