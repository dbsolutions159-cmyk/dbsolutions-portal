require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// CHAT API
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile"
        messages: [
          {
            role: "system",
            content: "You are DB Mitra AI, a helpful job assistant"
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      return res.json({ reply: "API error: " + JSON.stringify(data) });
    }

    const reply = data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.log(error);
    res.json({ reply: "AI not responding, try again." });
  }
});

// PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
