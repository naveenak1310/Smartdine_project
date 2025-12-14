package com.example.smartdine;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int userId;
    private Long restaurantId;
    private int persons;
    private String date;
    private String time;
    private String email;

    @Column(length = 500)
    private String note;

   
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "restaurantId", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Restaurant restaurant;

    public Booking() {}

  
    public Booking(int userId, Long restaurantId, int persons, String date, String time, String note, String email) {
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.persons = persons;
        this.date = date;
        this.time = time;
        this.note = note;
        this.email = email;
    }

 
    public Long getId() { return id; }
    public int getUserId() { return userId; }
    public Long getRestaurantId() { return restaurantId; }
    public int getPersons() { return persons; }
    public String getDate() { return date; }
    public String getTime() { return time; }
    public String getEmail() { return email; }
    public String getNote() { return note; }
    public Restaurant getRestaurant() { return restaurant; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(int userId) { this.userId = userId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }
    public void setPersons(int persons) { this.persons = persons; }
    public void setDate(String date) { this.date = date; }
    public void setTime(String time) { this.time = time; }
    public void setEmail(String email) { this.email = email; }
    public void setNote(String note) { this.note = note; }
}
