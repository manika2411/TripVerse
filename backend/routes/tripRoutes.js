const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");

const router = express.Router();

router.get("/", protect, getTrips);

router.get("/:id", protect, getTripById);

router.post("/", protect, createTrip);

router.put("/:id", protect, updateTrip);

router.delete("/:id", protect, deleteTrip);

module.exports = router;