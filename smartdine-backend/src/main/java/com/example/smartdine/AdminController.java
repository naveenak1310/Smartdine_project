package com.example.smartdine;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookingRepository bookingRepo;

    @GetMapping("/users")
public List<UserWithBookings> getUsersWithBookings() {
    List<User> users = userRepo.findAll();
    List<UserWithBookings> out = new ArrayList<>();

    for (User u : users) {
        if ("admin@smartdine.com".equalsIgnoreCase(u.getEmail())) {
            continue;
        }

        List<Booking> bookings = bookingRepo.findByUserId(u.getId());
        out.add(new UserWithBookings(
            u.getId(),
            u.getName(),
            u.getEmail(),
            bookings
        ));
    }

    return out;
}


    public static class UserWithBookings {
        private int id;
        private String name;
        private String email;
        private List<Booking> bookings;

        public UserWithBookings() {}

        public UserWithBookings(int id, String name, String email, List<Booking> bookings) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.bookings = bookings;
        }

        public int getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public List<Booking> getBookings() { return bookings; }

        public void setId(int id) { this.id = id; }
        public void setName(String name) { this.name = name; }
        public void setEmail(String email) { this.email = email; }
        public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
    }
}
