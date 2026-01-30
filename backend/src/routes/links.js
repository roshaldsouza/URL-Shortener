const express = require("express");
const router = express.Router();
const { listAllUrls } = require("../repositories/urlRepository");

router.get("/", async (req, res) => {
  try {
    const links = await listAllUrls();
    res.json({ links });
  } catch (error) {
    console.error("List links error:", error);
    res.status(500).json({ error: "Failed to load links" });
  }
});

module.exports = router;
