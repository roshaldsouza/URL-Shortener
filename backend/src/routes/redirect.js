const express = require("express");
const router = express.Router();
const { getLongUrl } = require("../services/shortCodeService");

router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const longUrl = await getLongUrl(code);

    if (!longUrl) {
      return res.status(404).send("URL not found");
    }

    // 🔒 Prevent redirect loop (short URL redirecting to itself)
    const selfUrl = `${req.protocol}://${req.get("host")}/${code}`;
    if (longUrl === selfUrl) {
      return res.status(500).send("Invalid redirect loop detected");
    }

    // ✅ Validate URL format
    try {
      new URL(longUrl);
    } catch {
      return res.status(500).send("Stored URL is invalid");
    }

    return res.redirect(302, longUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
