import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAreaForRestaurant } from "../utils/locationHelper";
import "./History.css";
import Lottie from "lottie-react";
import star1 from "../assets/1star.json";
import star2 from "../assets/2star.json";
import star3 from "../assets/3star.json";
import star4 from "../assets/4star.json";
import star5 from "../assets/5star.json";

export default function History() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    return (
      <section className="history-page">
        <h2>Please log in to view your history.</h2>
      </section>
    );
  }

  const city = user.location || "Default";
  const storageKey = `wishlist_user_${user.id}`;

  const [history, setHistory] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [reviewForm, setReviewForm] = useState({});
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [successAnim, setSuccessAnim] = useState(null);

  const starAnimations = {
    1: star1,
    2: star2,
    3: star3,
    4: star4,
    5: star5
  };

  useEffect(() => {
    fetch(`http://localhost:8080/api/bookings/${user.id}`)
      .then(res => res.json())
      .then(data => setHistory(data));

    const saved = localStorage.getItem(storageKey);
    if (saved) setWishlist(JSON.parse(saved));
  }, [user.id, storageKey]);

  const toggleWishlist = (restaurant) => {
    const exists = wishlist.some(r => r.id === restaurant.id);
    const updated = exists
      ? wishlist.filter(r => r.id !== restaurant.id)
      : [...wishlist, restaurant];

    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const isLiked = (id) => wishlist.some(r => r.id === id);

  const buildMapsUrl = (name, loc) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${loc}`)}`;

  const submitReview = (restaurantId) => {
    const form = reviewForm[restaurantId];
    if (!form || !form.rating || !String(form.text || "").trim()) return;

    const review = {
      restaurantId,
      userId: user.id,
      rating: parseInt(form.rating),
      text: form.text
    };

    fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    })
      .then(() => {
        setSuccessAnim(form.rating);
        setReviewForm({
          ...reviewForm,
          [restaurantId]: { rating: "", text: "" }
        });
        setShowReviewForm(null);
        setTimeout(() => setSuccessAnim(null), 2000);
      });
  };

  return (
    <>
      {successAnim && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "white",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Lottie
            animationData={starAnimations[successAnim]}
            style={{ width: 260, height: 260 }}
            loop={false}
          />
          <h2 style={{ marginTop: 20 }}>Thank you for your review!</h2>
        </div>
      )}

      <section className="history-page">
        <div className="history-card">
          <h2>Your Booking History</h2>

          {history.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <div className="history-grid">
              {history.map(b => {
                const restaurant = b.restaurant;
                if (!restaurant) return null;

                const image = restaurant.images
                  ? restaurant.images.split(",")[0]
                  : "/noimage.jpg";

                const area =
                  city === "Coimbatore"
                    ? restaurant.area
                    : getAreaForRestaurant(restaurant.id, city);

                const liked = isLiked(restaurant.id);

                return (
                  <div
                    key={b.id}
                    className="history-item"
                    onClick={() =>
                      navigate(`/restaurant/${restaurant.id}`, {
                        state: { area }
                      })
                    }
                  >
                    <div className="image-container">
                      <img src={image} alt={restaurant.name} />
                      <button
                        className={`heart-btn ${liked ? "liked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(restaurant);
                        }}
                      >
                        {liked ? "❤️" : "🤍"}
                      </button>
                    </div>

                    <div className="info">
                      <h3>{restaurant.name}</h3>

                      <p>
                        📍 {area}, {city}{" "}
                        <a
                          href={buildMapsUrl(restaurant.name, `${area} ${city}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Open in Maps
                        </a>
                      </p>

                      <p>🍽 {b.persons} persons — ⏰ {b.time}</p>
                      <p>📅 {b.date}</p>

                      <button
                        className="review-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReviewForm(
                            showReviewForm === restaurant.id
                              ? null
                              : restaurant.id
                          );
                          if (!reviewForm[restaurant.id]) {
                            setReviewForm({
                              ...reviewForm,
                              [restaurant.id]: { rating: "", text: "" }
                            });
                          }
                        }}
                      >
                        Add / Edit Review
                      </button>

                      {showReviewForm === restaurant.id && (
                        <div
                          className="review-form"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="star-rating">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span
                                key={s}
                                className={`star ${
                                  s <= (reviewForm[restaurant.id]?.rating || 0)
                                    ? "active"
                                    : ""
                                }`}
                                onClick={() =>
                                  setReviewForm({
                                    ...reviewForm,
                                    [restaurant.id]: {
                                      ...reviewForm[restaurant.id],
                                      rating: s
                                    }
                                  })
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>

                          <textarea
                            value={reviewForm[restaurant.id]?.text || ""}
                            onChange={(e) =>
                              setReviewForm({
                                ...reviewForm,
                                [restaurant.id]: {
                                  ...reviewForm[restaurant.id],
                                  text: e.target.value
                                }
                              })
                            }
                          />

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              submitReview(restaurant.id);
                            }}
                          >
                            Publish Review
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
