package com.example.smartdine;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173"})
public class AuthController {

    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();

        if (repo.findByEmail(user.getEmail()) != null) {
            res.put("success", false);
            res.put("message", "Email already registered");
            return res;
        }

        repo.save(user);

        res.put("success", true);
        res.put("message", "Signup success");
        res.put("user", user);
        return res;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> res = new HashMap<>();

        User db = repo.findByEmail(user.getEmail());
        if (db == null) {
            res.put("success", false);
            res.put("message", "User not found");
            return res;
        }

        if (!db.getPassword().equals(user.getPassword())) {
            res.put("success", false);
            res.put("message", "Wrong password");
            return res;
        }

        res.put("success", true);
        res.put("message", "Login success");
        res.put("user", db); 
        return res;
    }
}
