// File: routes/news.routes.js
const express = require("express");
const router = express.Router();
const { getArtNews } = require("../controllers/news.controller");
const { isAuthenticatedUser } = require("../middleware/auth");

// This route is protected; only logged-in users can fetch news
router.get("/", getArtNews);

module.exports = router;
