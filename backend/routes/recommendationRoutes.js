const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getTripRecommendations,
} = require("../controllers/recommendationController");

router.post("/", protect, getTripRecommendations);

module.exports = router;