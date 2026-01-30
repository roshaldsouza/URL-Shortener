const express = require("express");
const router = express.Router();
const { createShortUrl } = require("../services/shortCodeService");

router.post("/", async (req, res) => {
  try {
    const { longUrl } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "URL required" });
    }

    const shortCode = await createShortUrl(longUrl);
    const baseUrl = process.env.BASE_URL || "";
    res.json({ shortUrl: baseUrl ? `${baseUrl}/${shortCode}` : `/${shortCode}`, shortCode });
  } catch (error) {
    console.error("Shorten error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
