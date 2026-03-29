require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔍 DEBUG (IMPORTANT)
console.log("MONGO URI:", process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌");

// ✅ MongoDB Connect (Strong Version)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
  console.log("❌ MongoDB ERROR:");
  console.log(err);
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// 🤖 CHAT API (Optimized + Safe)
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message required ❗" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are DB Hire GPT, a friendly job assistant. Keep answers short, helpful, and guide users for jobs, resumes, and interviews."
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
      console.log("AI ERROR:", data);
      return res.json({ reply: "AI error, try again later ⚠️" });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.log("CHAT ERROR:", err.message);
    res.json({ reply: "Server error ⏳" });
  }
});

// ✅ SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
