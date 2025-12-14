package com.example.smartdine;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173"})
public class BookingController {
private final BookingRepository repo;
private final EmailService emailService;
private final RestaurantRepository restaurantRepo;
    
    @Autowired
    public BookingController(BookingRepository repo, EmailService emailService, RestaurantRepository restaurantRepo) {
        this.repo = repo;
        this.emailService = emailService;
        this.restaurantRepo = restaurantRepo;
    }

  @PostMapping
public Booking save(@RequestBody Booking booking) {
    Booking saved = repo.save(booking);

    
    Restaurant restaurant = restaurantRepo.findById(booking.getRestaurantId()).orElse(null);

    
    if (restaurant != null && booking.getEmail() != null && !booking.getEmail().isEmpty()) {
        try {
            emailService.sendBookingDetails(
                    booking.getEmail(),          
                    restaurant.getName(),        
                    booking.getDate().toString(),
                    booking.getTime().toString(),
                    booking.getPersons(),
                    booking.getNote()
            );
        } catch (Exception ex) {
            System.out.println("⚠ Email sending failed but booking saved.");
        }
    }

    return saved;
}

    @GetMapping("/{userId}")
    public List<Booking> getBookings(@PathVariable int userId) {
        return repo.findByUserId(userId);
    }
}
