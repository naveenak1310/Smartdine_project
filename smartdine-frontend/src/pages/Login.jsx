import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import enterAnim from "../assets/Enter.json";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const [showAnim, setShowAnim] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.75);
    }
  }, [showAnim]);


  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/auth/login", {
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

    const adminFlag = data.user && data.user.email === 'admin@smartdine.com';
    setIsAdmin(adminFlag);

    const saveUserWithCoords = (coords) => {
      const userWithCoords = {
        ...data.user,
        latitude: coords?.latitude ?? null,
        longitude: coords?.longitude ?? null,
      };
      localStorage.setItem("user", JSON.stringify(userWithCoords));
      localStorage.setItem("loggedIn", "true");
      if (adminFlag) localStorage.setItem("isAdmin", "true");
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
            onComplete={() => {
              const admin = localStorage.getItem("isAdmin") === "true";
              navigate(admin ? "/admin" : "/");
            }}
            style={{ width: 450, height: 450 }}
          />
        </div>
      )}

      {!showAnim && (
        <div className="login-container">
          <div className="login-card">
            <h2>🔐 Login</h2>

            {status && <div className="login-status">{status}</div>}

            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button onClick={submit}>Login 🚀</button>

            <p className="switch-auth">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
