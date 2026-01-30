const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API working" });
});

// your routes
const redirectRoutes = require("./routes/redirect");
const shortenRoutes = require("./routes/shorten");

app.use("/", redirectRoutes);
app.use("/shorten", shortenRoutes);

module.exports = app; // ✅ REQUIRED
