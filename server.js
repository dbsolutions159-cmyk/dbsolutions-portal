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

// TEST API
app.post("/api/chat", (req, res) => {
  const msg = req.body.message;

  res.json({
    reply: "Server working: " + msg
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
