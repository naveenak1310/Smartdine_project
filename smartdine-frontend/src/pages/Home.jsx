import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

import catering from "../assets/catering.json";
import chefKiss from "../assets/ChefKiss.json";
import { getAreaForRestaurant } from "../utils/locationHelper";

export default function Home() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const city = user?.location || "Default";

  useEffect(() => {
    fetch("http://localhost:8080/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <section className="home-page">
      <div className="home-card hero-flex">
        <div className="hero-anim">
          <Lottie animationData={catering} loop={false} autoplay style={{ height: 200 }} />
        </div>

        <div className="hero-center">
          <h1>Find Your Perfect Bite.</h1>
          <p>
            Type your mood, budget, and craving in simple words —
            <b> SmartDine </b> will instantly find the best restaurants for you.
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              localStorage.getItem("loggedIn")
                ? navigate("/search")
                : navigate("/login")
            }
          >
            Start Exploring Food
          </button>
        </div>

        <div className="hero-anim">
          <Lottie animationData={chefKiss} loop={false} autoplay style={{ height: 200 }} />
        </div>
      </div>

      <h2>Popular Restaurants in {city !== "Default" ? city : "Your Area"}</h2>

      <div className="restaurant-grid">
        {restaurants.map(r => {
          const displayArea =
            city === "Coimbatore"
              ? r.area
              : getAreaForRestaurant(r.id, city);

          const displayCity =
            city === "Coimbatore"
              ? r.location
              : city;

          return (
            <div
              key={r.id}
              className="restaurant-card"
              onClick={() => navigate(`/restaurant/${r.id}`)}
            >
              <div className="card-header">
                <h3>{r.name}</h3>
                <div className="rating-pill">
                  {r.rating > 0 ? `⭐ ${r.rating}` : "Not rated yet"}
                </div>
              </div>

              <div className="card-body">
                <p><b>Cuisine:</b> {r.cuisine}</p>
                <p><b>Price:</b> {r.priceRange}</p>
                <p>{r.description?.substring(0, 80)}...</p>
              </div>

              <div className="card-footer">
                <p>📍 {displayArea}, {displayCity}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
