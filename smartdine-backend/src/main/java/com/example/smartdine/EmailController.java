package com.example.smartdine;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailController {

    private final JavaMailSender sender;

    public EmailController(JavaMailSender sender) {
        this.sender = sender;
    }

    @PostMapping
    public String sendEmail(@RequestBody ContactRequest req) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("naveenak1310@gmail.com");
        msg.setSubject("SmartDine Inquiry from " + req.name());
        msg.setText(req.message() + "\n\nEmail: " + req.email());
        sender.send(msg);
        return "Email sent";
    }
}

record ContactRequest(String name, String email, String message) {}
