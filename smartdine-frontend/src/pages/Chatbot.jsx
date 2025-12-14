import { useState } from "react";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";
import typingAnim from "../assets/Typing.json";
import chatBubbleAnim from "../assets/chatbot.json";
import Lottie from "lottie-react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "there";

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `👋 Hey ${username}, I'm SmartDine Assistant! How can I help you today?`,
    },
  ]);

  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const restaurantAreas = {
    Coimbatore: ["Peelamedu", "RS Puram", "Gandhipuram", "Race Course", "Saravanampatti", "Town Hall", "Kavundampalayam", "Ukkadam", "Sitra", "Singanallur"],
    Chennai: ["T Nagar", "Anna Nagar", "Velachery", "Porur", "Tambaram", "Adyar", "Vadapalani", "Ashok Nagar", "Pallavaram", "Guindy"],
    Bangalore: ["Whitefield", "Indiranagar", "Koramangala", "Jayanagar", "HSR Layout", "JP Nagar", "Marathahalli", "Bellandur", "Malleshwaram", "Hebbal"],
    Hyderabad: ["Hitech City", "Gachibowli", "Banjara Hills", "Ameerpet", "Secunderabad", "Madhapur", "Kukatpally", "Begumpet", "Koti", "Charminar"],
    Mumbai: ["Andheri", "Bandra", "Juhu", "Powai", "Colaba", "Dadar", "Borivali", "Goregaon", "Malad", "Worli"],
    Delhi: ["Connaught Place", "Saket", "Dwarka", "Karol Bagh", "Hauz Khas", "Rajouri Garden", "Vasant Kunj", "Janakpuri", "Lajpat Nagar", "Rohini"],
    Pune: ["Viman Nagar", "Kothrud", "Koregaon Park", "Hinjewadi", "Wakad", "Baner", "Hadapsar", "Magarpatta", "Camp", "Swargate"],
    Default: ["City Center", "Near You", "Main Road", "Food Street", "Downtown", "Market Area", "Bus Stand Road", "Mall Area", "Central Square", "Old Town", "New Colony", "Tech Park", "College Road", "Lake View", "Museum Road", "Theater Road", "River Side", "Fort Area"]
  };

  const send = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");

   
    setMessages((prev) => [...prev, { sender: "bot", typing: true }]);

    const city = user?.location || "Default";

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg, city }),
      });

      const data = await res.json();
      let reply = data.reply;

    
      setMessages((prev) => prev.filter((m) => !m.typing));

      
      if (reply.startsWith("BOOK:")) {
        const id = reply.replace("BOOK:", "").trim();

        const areas = restaurantAreas[city] || restaurantAreas.Default;
        const area = areas[(id - 1) % areas.length];

      
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🚗 Redirecting to booking page..." }
        ]);

      
        setPopup("Redirecting to booking page...");

        setTimeout(() => {
          setPopup("");
          navigate(`/restaurant/${id}`, { state: { area } });
        }, 1200);

        return;
      }

     
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠ Bot not available now. Try again later." },
      ]);
    }
  };

  return (
    <>
      
      <button className="chat-bubble" onClick={() => setOpen(!open)}>
        <Lottie
          animationData={chatBubbleAnim}
          loop={false}
          autoplay={true}
          style={{ height: 95, width: 95 }}
        />
      </button>

      {open && (
        <div className="chat-window">
          <h3>SmartDine Assistant 🤖</h3>

          {popup && <div className="popup-box">{popup}</div>}

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender} ${m.typing ? "typing" : ""}`}>
                {m.typing ? (
                  <Lottie
                    animationData={typingAnim}
                    loop
                    style={{ height: 50, width: 50, marginLeft: "-4px" }}
                  />
                ) : (
                  m.text
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything... (ex: spicy biryani, cheap pasta)"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
