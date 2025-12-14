import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RestaurantDetails.css";
import Lottie from "lottie-react";
import tableAnim from "../assets/Restaurantable.json";
import { buildMapsUrl } from "../utils/mapshelper";
import { getAreaForRestaurant } from "../utils/locationHelper";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showAnim, setShowAnim] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [userCoords, setUserCoords] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const city = user?.location || "Default";

  useEffect(() => {
    fetch(`http://localhost:8080/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => setRestaurant(data));

    fetch(`http://localhost:8080/api/reviews/restaurant/${id}`)
      .then(res => res.json())
      .then(data => setReviews(data));
  }, [id]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      pos =>
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
      () => setUserCoords(null),
      { enableHighAccuracy: true }
    );
  }, []);

  if (!restaurant) {
    return <h2 className="loading-message">Loading restaurant details...</h2>;
  }

  const displayArea =
    city === "Coimbatore"
      ? restaurant.area
      : getAreaForRestaurant(restaurant.id, city);

  const displayCity =
    city === "Coimbatore"
      ? restaurant.location
      : city;

  const imageList = restaurant.images ? restaurant.images.split(",") : [];

  const nextImage = () =>
    setCurrentImage(prev =>
      prev === imageList.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setCurrentImage(prev =>
      prev === 0 ? imageList.length - 1 : prev - 1
    );

  const bookNow = () => {
    setShowAnim(true);
    const loggedIn = localStorage.getItem("loggedIn");

    setTimeout(() => {
      if (!loggedIn) navigate("/login");
      else navigate(`/booking/${id}`);
    }, 1800);
  };

  if (showAnim) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 9999
        }}
      >
        <Lottie animationData={tableAnim} loop={false} style={{ height: 260 }} />
        <p style={{ fontSize: 20, marginTop: 10, fontWeight: 600 }}>
          Preparing your table...
        </p>
      </div>
    );
  }

  return (
    <div className="details-page-container">
      <div className="restaurant-header">
        <h1>{restaurant.name}</h1>
        <div className="rating-badge">
          Rating: {restaurant.rating > 0 ? `${restaurant.rating}★` : "Not rated yet"}
        </div>
      </div>

      <div className="details-content">
        <div className="image-column">
          <div className="carousel">
            <button className="carousel-btn left" onClick={prevImage}>{"<"}</button>
            <img src={imageList[currentImage]} alt={restaurant.name} className="carousel-img" />
            <button className="carousel-btn right" onClick={nextImage}>{">"}</button>
          </div>
        </div>

        <div className="info-column">
          <p className="desc">{restaurant.description}</p>

          <div className="info-grid">
            <div className="info-item"><b>Cuisine:</b> {restaurant.cuisine}</div>
            <div className="info-item"><b>Price Range:</b> {restaurant.priceRange}</div>
          </div>

          <div className="location-box">
            <p>📍 {displayArea}, {displayCity}</p>

            <a
              href={buildMapsUrl(restaurant, userCoords)}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              Get Directions
            </a>
          </div>

          <button className="book-btn" onClick={bookNow}>🍽 Book a Table Now</button>

          <button className="reviews-btn" onClick={() => setShowReviews(!showReviews)}>
            📝 Reviews ({reviews.length})
          </button>

          {showReviews && (
            <div className="reviews-section">
              <h3>Customer Reviews</h3>

              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">
                          {"⭐".repeat(review.rating)} ({review.rating}/5)
                        </div>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
