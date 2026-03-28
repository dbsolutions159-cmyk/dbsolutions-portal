require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// ✅ AI CHAT ROUTE (FINAL)
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "You are DB Mitra AI, a smart job assistant from DB Solutions. Help users find jobs, guide them professionally, and behave like a premium AI consultant."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // DEBUG (optional but useful)
    console.log(data);

    const reply =
      data?.choices?.[0]?.message?.content ||
      "AI not responding properly.";

    res.json({ reply });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ reply: "Server error, try again." });
  }
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
