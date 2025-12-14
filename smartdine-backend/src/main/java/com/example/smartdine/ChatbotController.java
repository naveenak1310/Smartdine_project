package com.example.smartdine;

import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatbotController {

    private static final String API_KEY = "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";

    @Autowired
    private RestaurantRepository restaurantRepo;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        String question = body.get("question");
        String userCity = body.get("city");

        List<Restaurant> restaurants = restaurantRepo.findAll();

        
        StringBuilder context = new StringBuilder();
for (Restaurant r : restaurants) {
    context.append(r.getName()).append(" - ")
            .append(r.getCuisine()).append(", ")
            .append(r.getPriceRange()).append(", ")
            .append(r.getRating()).append(" stars, ")
            .append("Location: ").append(r.getLocation())
            .append("\n");
}


        String systemPrompt = """
You are SmartDine AI — a friendly restaurant recommendation assistant.
Recommend ONLY from the restaurant list below. Never create fake restaurants.

When the user asks for suggestions:
• Suggest 1-3 restaurants only
• For each, include these details:
 <name>
(Cuisine:<cuisine>
 Price:<price> 
 Rating:<rating>⭐)
• After the list, add a short 1-sentence explanation based on the user's mood
• Speak in a friendly natural style — not robotic


Example reply:

Pasta Bella
(Cuisine:Italian 
 Price:Expensive
 Rating:4.6⭐)

Little Italy
(Cuisine:Italian 
 Price:Medium 
 Rating:4.3⭐)

These places match your craving for rich flavors.

📌 The user's city is: %s

📌 Restaurants:
%s

If the user wants to book/reserve/table/seat:
Reply ONLY in this exact format:
BOOK:<restaurant_name>
NO other text. NO explanation. NO emojis.
""".formatted(userCity, context);


        try {
            OkHttpClient client = new OkHttpClient();
            MediaType mediaType = MediaType.parse("application/json");

            String payload = """
            {
              "model": "meta-llama/llama-3.2-3b-instruct",
              "messages": [
                {"role": "system", "content": "%s"},
                {"role": "user", "content": "%s"}
              ]
            }
            """.formatted(systemPrompt.replace("\"", "'"), question.replace("\"", "'"));

            okhttp3.RequestBody requestBody = okhttp3.RequestBody.create(payload, mediaType);

            Request request = new Request.Builder()
                    .url("https://openrouter.ai/api/v1/chat/completions")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Authorization", "Bearer " + API_KEY)
                    .addHeader("HTTP-Referer", "http://localhost:5173")
                    .addHeader("X-Title", "SmartDine-Chatbot")
                    .build();

            Response response = client.newCall(request).execute();
            String resBody = response.body().string();

            JSONObject json = new JSONObject(resBody);
            JSONArray choices = json.optJSONArray("choices");
            if (choices == null)
                return ResponseEntity.ok(Map.of("reply", "⚠ No response from AI"));

            String reply = choices.getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .trim();

            
            if (reply.startsWith("BOOK:")) {
                String name = reply.replace("BOOK:", "").trim().toLowerCase();

                for (Restaurant r : restaurants) {
                    if (r.getName().toLowerCase().contains(name)) {
                        return ResponseEntity.ok(Map.of("reply", "BOOK:" + r.getId()));
                    }
                }

                return ResponseEntity.ok(Map.of("reply",
                        "⚠ Restaurant not found in database. Try exact hotel name."));
            }

            
            return ResponseEntity.ok(Map.of("reply", reply));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("reply",
                    "⚠ SmartDine AI is offline. Please try later."));
        }
    }
}
