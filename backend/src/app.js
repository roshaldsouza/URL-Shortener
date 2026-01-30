const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API working" });
});

// your routes (specific paths before catch-all redirect)
const redirectRoutes = require("./routes/redirect");
const shortenRoutes = require("./routes/shorten");
const linksRoutes = require("./routes/links");

app.use("/shorten", shortenRoutes);
app.use("/links", linksRoutes);
app.use("/", redirectRoutes);

module.exports = app; // ✅ REQUIRED
