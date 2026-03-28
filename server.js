require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("DB Backend Running 🚀");
});
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;

  res.json({
    reply: "You said: " + userMessage
  });
});

// PORT (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
