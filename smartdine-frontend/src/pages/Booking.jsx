import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Booking.css";

import Lottie from "lottie-react";
import approveAnim from "../assets/approve.json";

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [popup, setPopup] = useState("");

    const [loadingSuccess, setLoadingSuccess] = useState(false); 

   
    const today = new Date().toISOString().split('T')[0];

    const [form, setForm] = useState({
        persons: "",
        date: "",
        time: "",
        note: "",
        email: ""
    });

    
    useEffect(() => {
        fetch(`http://localhost:8080/api/restaurants/${id}`)
            .then((res) => res.json())
            .then((data) => setRestaurant(data))
            .catch((err) => console.log(err));
    }, [id]);

   
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({ ...prevForm, [name]: value }));
    };

    
    const confirm = async () => {
        if (!restaurant) {
            setPopup("⏳ Restaurant is still loading...");
            setTimeout(() => setPopup(""), 1500);
            return;
        }

        
        if (!form.persons || !form.date || !form.time || !form.email) {
            setPopup("⚠️ Please fill in all required fields.");
            setTimeout(() => setPopup(""), 2000);
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return navigate("/login");

        const bookingData = {
            userId: user.id,
            restaurantId: restaurant.id,
            persons: Number(form.persons),
            date: form.date,
            time: form.time,
            note: form.note,
            email: form.email
        };

        try {
            const res = await fetch("http://localhost:8080/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            if (!res.ok) {
                const errorText = await res.text();
                const errorMsg = errorText || "Booking failed. Please try again.";
                setPopup(`❌ ${errorMsg}`);
                setTimeout(() => setPopup(""), 3000);
                return;
            }

          
            setLoadingSuccess(true);

           
            setTimeout(() => {
                
               
            }, 2500);

        } catch (err) {
            setPopup("⚠ Network error — try again later.");
            setTimeout(() => setPopup(""), 2000);
        }
    };


    if (loadingSuccess) {
        return (
            <div className="success-screen">
                <Lottie
                    animationData={approveAnim}
                    loop={false}
                    style={{ height: 200, width: 200 }}
                />
                <h2 className="success-title">Reservation Confirmed!</h2>
                <p className="success-message">
                    Your table at **{restaurant.name}** has been successfully booked. A confirmation email is on its way.
                </p>
                <button className="go-history-btn" onClick={() => navigate("/history")}>
                    View My Bookings
                </button>
            </div>
        );
    }

 
    if (!restaurant) {
        
        return <div className="app-main"><h2 className="loading-message">Loading restaurant data...</h2></div>;
    }

   
    return (
       
        <section className="booking-page">
            <div className="booking-card">
                
                {popup && <div className="popup-box">{popup}</div>}

                <h2 className="card-title">Reserve a Table at</h2>
                <h3 className="restaurant-name">{restaurant.name}</h3>

                <form onSubmit={(e) => { e.preventDefault(); confirm(); }}>
                    <label htmlFor="email">Email for Booking Details</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="example@mail.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="persons">Number of Guests (Minimum 1)</label>
                    <input
                        id="persons"
                        type="number"
                        name="persons"
                        min="1"
                        placeholder="e.g., 4"
                        value={form.persons}
                        onChange={handleChange}
                        required
                    />

                    <div className="datetime-group">
                        <div className="date-input-container">
                            <label htmlFor="date">Reservation Date</label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                min={today}
                                required
                            />
                        </div>
                        
                        <div className="time-input-container">
                            <label htmlFor="time">Reservation Time</label>
                            <input
                                id="time"
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <label htmlFor="note">Additional Notes (Optional)</label>
                    <textarea
                        id="note"
                        name="note"
                        placeholder="Allergies, seating preference, birthday request..."
                        value={form.note}
                        onChange={handleChange}
                    />

                    <button type="submit" className="confirm-btn">
                        Complete Reservation
                    </button>
                </form>
            </div>
        </section>
    );
}