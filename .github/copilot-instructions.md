<!-- Copilot / AI assistant instructions for the SmartDine repository -->
# SmartDine — AI assistant quick guide

Purpose: give AI coding agents the minimal, concrete context to be productive in this repo.

- **Repo layout (important places):**
  - `smartdine-backend/` — Spring Boot backend (Java 21, Spring Boot 3.2.5). Main app: `com.example.smartdine.SmartDineApplication`.
  - `smartdine-backend/pom.xml` — Maven build and dependencies (web, data-jpa, mail, MySQL connector).
  - `smartdine-backend/src/main/resources/application.properties` — DB and SMTP configuration (change credentials here for local dev).
  - `smartdine-backend/src/main/resources/data.sql` — seed data inserted on startup.
  - `smartdine-frontend/` — Vite + React frontend. Entry: `src/main.jsx`, pages under `src/pages/`.

- **Big picture / architecture:**
  - The backend is a simple REST service providing restaurant recommendations. It stores data in MySQL using Spring Data JPA (`Restaurant` entity + `RestaurantRepository`).
  - Recommendation logic is rule-based and lives in `RecommendationService` (keyword matching + scoring).
  - Frontend calls backend APIs from dev host `http://localhost:5173` (CORS allowed for 5173 and 3000 in controller).

- **Developer workflows / commands:**
  - Start MySQL and create the DB used by this project: `CREATE DATABASE smartdine_db;` (see `README.txt`).
  - Update DB credentials in `smartdine-backend/src/main/resources/application.properties` before running.
  - Run backend (development):
    ```powershell
    cd smartdine-backend
    mvn spring-boot:run
    ```
  - Or build and run the jar:
    ```powershell
    cd smartdine-backend
    mvn package
    java -jar target/smartdine-backend-0.0.1-SNAPSHOT.jar
    ```
  - Run frontend (development):
    ```powershell
    cd smartdine-frontend
    npm install
    npm run dev
    ```

- **Key patterns & conventions (project-specific):**
  - JPA repositories extend `JpaRepository<T, ID>` (see `RestaurantRepository.java`, `UserRepository.java`).
  - Controllers use `@RestController` + `@RequestMapping("/api")` and allow CORS for local dev.
  - Recommendation logic is intentionally simple and local: tweak `RecommendationService.scoreRestaurant` or the `keywords` array to change behavior (example keywords: `spicy, cheesy, comfort, biryani, pizza`).
  - Sample endpoints:
    - `POST /api/recommend` — body: `{ "query": "cheesy but cheap" }` returns `RecommendationResponse`.
    - `GET /api/restaurants` — returns all restaurants.
    - `GET /api/surprise` — random pick.

- **Integration points & external deps:**
  - MySQL (runtime) — `com.mysql:mysql-connector-j` in `pom.xml`.
  - SMTP (optional) — `spring-boot-starter-mail` configured in `application.properties` (credentials are present in file; treat as secrets).
  - Frontend ↔ Backend: frontend calls backend on `localhost:8080` (backend serves JSON REST).

- **Files that demonstrate common edits:**
  - To add/change recommendation rules: edit `smartdine-backend/src/main/java/com/example/smartdine/RecommendationService.java` (look for `keywords` array and `scoreRestaurant` logic).
  - To change endpoints / CORS: edit `RecommendationController.java`.
  - To update seed data: edit `smartdine-backend/src/main/resources/data.sql` (executed at app startup).

- **Security / secrets note:**
  - `application.properties` currently contains SMTP username/password and DB values. Do not commit new secrets; prefer local env overrides for private credentials.

- **Small ready-to-use examples (copyable):**
  - curl request for a recommendation:
    ```bash
    curl -X POST http://localhost:8080/api/recommend -H "Content-Type: application/json" -d '{"query":"cheesy and cheap"}'
    ```
  - Quick change to prefer `healthy` restaurants: add `if (q.contains("healthy") && cuisine.contains("healthy")) score += 3;` inside `scoreRestaurant`.

If anything above is unclear or you want more detail (tests, CI, or code areas to avoid changing), tell me which section to expand or edit.
