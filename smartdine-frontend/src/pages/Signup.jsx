import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import enterAnim from "../assets/Enter.json";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    location: ""
  });

  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState("");
  const [showAnim, setShowAnim] = useState(false);

  const navigate = useNavigate();
  const lottieRef = useRef(null);


  useEffect(() => {
    if (showAnim && lottieRef.current) {
      lottieRef.current.setSpeed(1.75);
    }
  }, [showAnim]);

  const fetchSuggestions = async (text) => {
    setForm({ ...form, location: text });
    if (!text.trim()) return setSuggestions([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${text}`
    );
    setSuggestions(await res.json());
  };

  const selectLocation = (place) => {
    const city =
      place.address.city ||
      place.address.town ||
      place.address.state ||
      place.address.county ||
      place.address.village ||
      "Unknown";

    setForm({ ...form, location: city });
    setSuggestions([]);
  };

  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!data.success) {
      setStatus(data.message);
      setTimeout(() => setStatus(""), 3500);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("loggedIn", "true");

    const saveUserWithCoords = (coords) => {
      const userWithCoords = {
        ...data.user,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      };
      localStorage.setItem("user", JSON.stringify(userWithCoords));
      localStorage.setItem("loggedIn", "true");
      setShowAnim(true);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => saveUserWithCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => saveUserWithCoords(null),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      saveUserWithCoords(null);
    }
  };

  return (
    <>
      {showAnim && (
        <div className="enter-overlay">
         <Lottie
  lottieRef={lottieRef}
  animationData={enterAnim}
  loop={false}
  onDOMLoaded={() => {
    if (lottieRef.current) lottieRef.current.setSpeed(1.75);
  }}
  onComplete={() => navigate("/")}
  style={{ width: 450, height: 450 }}
/>

        </div>
      )}

      {!showAnim && (
        <div className="signup-container">
          <div className="signup-card">
            <h2>Create Account</h2>

            {status && <div className="signup-status">{status}</div>}

            <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

            <input
              placeholder="Enter your city"
              value={form.location}
              onChange={(e) => fetchSuggestions(e.target.value)}
            />

            {suggestions.length > 0 && (
              <ul className="suggestions-box">
                {suggestions.map((s) => (
                  <li key={s.place_id} onClick={() => selectLocation(s)}>
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={submit}>Signup 🚀</button>

            <p className="switch-auth">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
