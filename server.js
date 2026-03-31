require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ IMPORT JOB MODEL
const Job = require("./models/Job");

// 🔥 ENV CHECK
console.log("ENV CHECK:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI NOT FOUND");
  process.exit(1);
}

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err.message));

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});

// 🔍 SIMPLE QUERY EXTRACTOR
function extractQuery(msg) {
  const m = msg.toLowerCase();

  let role = "";
  let location = "";

  if (m.includes("customer")) role = "customer";
  if (m.includes("support")) role = "support";
  if (m.includes("sales")) role = "sales";
  if (m.includes("bpo")) role = "bpo";

  if (m.includes("bhopal")) location = "bhopal";
  if (m.includes("indore")) location = "indore";
  if (m.includes("bangalore")) location = "bangalore";

  return { role, location };
}

// 🤖 FINAL CHAT API (AI + JOBS)
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "Message required ❌", jobs: [] });
    }

    // 🔍 FIND JOBS
    const { role, location } = extractQuery(userMessage);

    let query = {};

    if (role) query.title = { $regex: role, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };

    let jobs = await Job.find(query).limit(3);

    if (jobs.length === 0) {
      jobs = await Job.find().limit(3);
    }

    // 🤖 AI CALL (SAFE)
    let aiReply = "";

    try {
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
              content: `
You are DB Hire assistant.

- Talk like human
- Keep short replies
- Show jobs if available
- Don't repeat questions
`
            },
            {
              role: "user",
              content: userMessage
            }
          ]
        })
      });

      const data = await response.json();

      aiReply = data?.choices?.[0]?.message?.content || "";

    } catch (err) {
      console.log("AI ERROR:", err);
      aiReply = "";
    }

    // 🧠 FINAL RESPONSE
    let finalReply = aiReply;

    if (jobs.length > 0) {
      finalReply += "\n\n🔥 Jobs mil gayi:";
    } else {
      finalReply += "\n\nKoi jobs nahi mili abhi.";
    }

    res.json({
      reply: finalReply,
      jobs
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({
      reply: "Server error ❌",
      jobs: []
    });
  }
});

// ✅ GET JOBS
app.get("/api/jobs", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
