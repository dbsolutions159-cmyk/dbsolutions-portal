require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Node 18+ में fetch built-in होता है
// अगर error आए तो: npm install node-fetch

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 DEBUG
console.log("MONGO URI:", process.env.MONGO_URI);

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("Mongo Error ❌:", err.message));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// 🤖 CHAT API (SMART FRIEND STYLE)
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
            content: "You are DB Hire GPT, a smart friendly job assistant. Talk like a helpful friend, give short clear answers, guide users for jobs, resumes and interviews."
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
      return res.json({ reply: "AI error: " + JSON.stringify(data) });
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Server error, try again ⏳" });
  }
});

// ✅ SERVER START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
