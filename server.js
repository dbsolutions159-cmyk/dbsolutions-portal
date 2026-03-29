require("dotenv").config();   // 👈 सबसे पहले

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error:", err));
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// server start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});











const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// ✅ CHAT API (IMPORTANT)
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

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

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Server error, try again ⏳" });
  }
});

// SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
