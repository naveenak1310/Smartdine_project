import { useState } from "react";
import "./Contact.css";
import Lottie from "lottie-react";
import emailAnim from "../assets/email.json"; 

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false); 

  const send = async () => {
    setSending(true); 

    
    setTimeout(async () => {
      try {
        const res = await fetch("http://localhost:8080/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (res.ok) {
          setStatus("Message sent successfully! ✔");
          setForm({ name: "", email: "", message: "" });
        } else {
          setStatus("Something went wrong. Please try again ❌");
        }
      } catch {
        setStatus("Server not reachable ❌");
      }

      setSending(false); 
      setTimeout(() => setStatus(""), 4000);
    }, 1500); 
  };


if (sending) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Lottie
  animationData={emailAnim}
  loop={false}
  speed={2.5}       
  style={{ height: 220 }}
/>

      <p style={{ marginTop: 15, fontSize: "20px", fontWeight: "500" }}>
        Sending your message...
      </p>
    </div>
  );
}

return (
  <div className="contact-page">
    <div className="contact-card">
      
      {status && <div className="popup-status">{status}</div>}

      <h2 className="contact-title">📩 Contact Us</h2>
      <p className="contact-subtitle">
        We’d love to hear your questions, feedback, or suggestions.
      </p>

      <label>Your Name</label>
      <input
        value={form.name}
        placeholder="Enter your name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <label>Your Email</label>
      <input
        value={form.email}
        placeholder="example@mail.com"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <label>Message</label>
      <textarea
        value={form.message}
        placeholder="Write your message..."
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <button className="contact-btn" onClick={send}>
        Send Message
      </button>
    </div>
  </div>
);
}