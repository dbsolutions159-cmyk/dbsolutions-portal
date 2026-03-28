
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 API KEY (अपनी Groq key डालो)
const API_KEY = process.env.API_KEY;

// TEST
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// CHAT AI
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are DB Mitra AI, a smart job assistant for DB Solutions."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    res.json({
      reply: "Error connecting AI"
    });
  }
});

// SERVER
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});