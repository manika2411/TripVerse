const express = require("express");

const {
  saveBudget,
  getBudgets,
  getBudgetByDestination,
  deleteBudget,
} = require("../controllers/budgetController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getBudgets);

router.get("/destination/:code", protect, getBudgetByDestination);

router.post("/", protect, saveBudget);

router.delete("/:id", protect, deleteBudget);

module.exports = router;
