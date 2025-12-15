# SmartDine – Restaurant Recommendation by AI Assistant

SmartDine is a full-stack web application that helps users discover nearby restaurants, get food recommendations based on their preferences,their moods and book tables easily.  

The project demonstrates full-stack development using React, Spring Boot, and MySQL.

---
## How It Works

### 🤖 Conversational Search
Type naturally like you'd ask a friend:
- *"something healthy like salad"*
- *"Spicy Biryani cheap and best"*
- *"i want french fries and burger"*
### 🎲 "Surprise Me" Feature
Can't decide? Let SmartDine pick something perfect for you based on random suggestion.
## Project Overview

SmartDine allows users to:
- Register and log in
- Search restaurants using simple text queries
- View restaurant details such as cuisine, price range, ratings, reviews and images
- Book tables and view booking history
- Add restaurants to a wishlist
- Submit ratings and reviews

An admin dashboard is included for managing restaurant data and bookings.
Admin can add a new restauarant.

---

## Tech Stack

**Frontend**
- React JS
- JavaScript
- HTML
- CSS

**Backend**
- Java
- Spring Boot
- Spring Web (REST APIs)
- JPA Data

**Database**
- MySQL

**Tools**
- Postman – API testing and debugging
- LottieFiles – animations used in the UI
- OpenRouter API (Chatbot feature)

---

## Project Structure
```
smartdine-mysql-project
├── smartdine-frontend
│   └── src
├── smartdine-backend
│   └── src
├── README.md
└── .gitignore
```

---

## Instructions to Setup and Run the Application

### 1. Clone the Repository
```bash
git clone https://github.com/naveenak1310/SmartDine_project.git
```

### 2. Navigate to Backend Folder
```bash
cd smartdine-backend
```

### 3. Configure MySQL Database

- Create a MySQL database (example: `smartdine_db`)
- Update database credentials in:
```
src/main/resources/application.properties
```

### 4. Set OpenRouter API Key (Environment Variable)

**Windows (PowerShell)**
```powershell
setx OPENROUTER_API_KEY "your_api_key_here"
```

Restart the terminal after setting the variable.

### 5. Run the Backend
```bash
mvn spring-boot:run
```

Backend will start at:
```
http://localhost:8080
```

---

## Frontend Setup

### 6. Navigate to Frontend Folder
```bash
cd smartdine-frontend
```

### 7. Install Dependencies
```bash
npm install
```

### 8. Start the Frontend
```bash
npm run dev
```

Frontend will start at:
```
http://localhost:5173
```

---

## Database Tables

- users
- restaurants
- bookings
- reviews
- restaurant_tags

---

## Security Notes

- API keys are stored using environment variables
- `.env`, `node_modules`, `target`, and build folders are ignored via `.gitignore`
- No sensitive information is committed to GitHub

---

## Features

- User authentication
- Restaurant search and recommendations
- Table booking system
- Booking history
- Wishlist management
- Ratings and reviews
- Admin dashboard
- Chatbot integration
- 16 Animation for UI

---

## Author

**Naveen**  
Full Stack Developer  
Java | Spring Boot | React | MySQL
