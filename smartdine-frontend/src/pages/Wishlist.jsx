import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";
import { buildMapsUrl } from "../utils/mapshelper";
import { getAreaForRestaurant } from "../utils/locationHelper";

export default function Wishlist() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const city = user?.location || "Default";
  const storageKey = `wishlist_user_${user?.id}`;
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) setWishlist(JSON.parse(saved));
  }, [storageKey, user]);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(r => r.id !== id);
    setWishlist(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <section className="wishlist-page">
      <div className="wishlist-card">
        <h2>❤️ Your Wishlist</h2>

        {wishlist.length === 0 ? (
          <p>No restaurants in your wishlist yet.</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(r => {
              const image = r.images ? r.images.split(",")[0] : "/noimage.jpg";

              const displayArea =
                city === "Coimbatore"
                  ? r.area
                  : getAreaForRestaurant(r.id, city);

              const displayCity =
                city === "Coimbatore"
                  ? r.location
                  : city;

              return (
                <div key={r.id} className="wishlist-item">
                  <img src={image} alt={r.name} />

                  <div className="info">
                    <h3>{r.name}</h3>
                    <p><b>Cuisine:</b> {r.cuisine}</p>
                    <p><b>Price:</b> {r.priceRange}</p>

                    <p className="location">
                      📍 {displayArea}, {displayCity}
                      <a
                        href={buildMapsUrl(r)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 6 }}
                      >
                        Open in Maps
                      </a>
                    </p>

                    <div className="wishlist-actions">
                      <button onClick={() => navigate(`/restaurant/${r.id}`)}>
                        View Details
                      </button>
                      <button onClick={() => removeFromWishlist(r.id)}>
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
