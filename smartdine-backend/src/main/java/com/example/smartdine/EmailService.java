package com.example.smartdine;

import java.util.Properties;

import org.springframework.stereotype.Service;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    public void sendBookingDetails(String toEmail, String restaurant, String date, String time, int persons, String note) {
        String from = "naveenak1310@gmail.com"; 
        String password = "rlfa ttmq hnph kesm";

        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        });

        try {
            MimeMessage msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));
            msg.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            msg.setSubject("Your SmartDine Booking Details");

            msg.setText(
                    "Your Table Has Been Booked! 🎉\n\n" +
                    "🏬 Restaurant: " + restaurant + "\n" +
                    "📅 Date: " + date + "\n" +
                    "⏰ Time: " + time + "\n" +
                    "🍽 Persons: " + persons + "\n" +
                    (note != null && !note.isEmpty() ? "📝 Note: " + note + "\n\n" : "\n") +
                    "Thank you for choosing SmartDine!"
            );

            Transport.send(msg);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
