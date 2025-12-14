package com.example.smartdine;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserController {

    @Autowired
    private UserRepository repo;

    
    @PostMapping("/update-location")
    public String updateLocation(@RequestBody User update) {
        User user = repo.findById(update.getId()).orElse(null);
        if (user == null) return "User not found";

        user.setLocation(update.getLocation());
        repo.save(user);
        return "Location updated";
    }
}
