require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 DEBUG (IMPORTANT)
console.log("ENV CHECK:", process.env.MONGO_URI);

// ❌ अगर undefined आया तो env problem
if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI NOT FOUND");
  process.exit(1);
}

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.log("❌ Mongo Error:", err.message));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// 🤖 CHAT API
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
            content: "You are DB Hire GPT, a smart friendly job assistant."
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
      reply: data?.choices?.[0]?.message?.content || "AI error"
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ reply: "Server error ⏳" });
  }
});

// ✅ START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});
