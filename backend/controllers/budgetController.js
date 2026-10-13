const mongoose = require("mongoose");
const Budget = require("../models/Budget");

const EXPENSE_KEYS = [
  "accommodation",
  "food",
  "transport",
  "activities",
  "shopping",
  "other",
];

// A real ISO-4217 style code: exactly three letters. Rejects "0", "", "undefined"...
const CURRENCY_REGEX = /^[A-Za-z]{3}$/;

const toAmount = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

/**
 * Read expense amounts from the request body.
 *
 * Canonical shape:  { expenses: { accommodation, food, ... } }
 * Also accepted:    { accommodation, food, ... }  (flat fields)
 *
 * Accepting both means a client can never silently lose its expenses just
 * because it nested (or didn't nest) them.
 */
const readExpenses = (body = {}) => {
  const source =
    body.expenses && typeof body.expenses === "object" ? body.expenses : body;

  return EXPENSE_KEYS.reduce((result, key) => {
    result[key] = toAmount(source[key]);
    return result;
  }, {});
};

const sumExpenses = (expenses = {}) =>
  EXPENSE_KEYS.reduce((sum, key) => sum + (Number(expenses[key]) || 0), 0);

/**
 * Always return totals that are derived from the stored expense fields, never
 * the (possibly stale / legacy) stored totals.
 */
const serializeBudget = (doc) => {
  if (!doc) return null;

  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const totalExpenses = sumExpenses(plain.expenses);
  const budget = Number(plain.budget) || 0;

  return {
    ...plain,
    budget,
    totalExpenses,
    remainingBudget: budget - totalExpenses,
  };
};

const saveBudget = async (req, res) => {
  try {
    const { destination, destinationCode, currency } = req.body;

    if (!destination || !destinationCode) {
      return res.status(400).json({
        success: false,
        message: "Destination and destination code are required",
      });
    }

    if (!currency || !CURRENCY_REGEX.test(String(currency).trim())) {
      return res.status(400).json({
        success: false,
        message: "A valid 3-letter currency code is required",
      });
    }

    const budget = Number(req.body.budget);

    if (!Number.isFinite(budget) || budget < 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a valid, non-negative number",
      });
    }

    const expenses = readExpenses(req.body);
    const totalExpenses = sumExpenses(expenses);

    if (totalExpenses > budget) {
      return res.status(400).json({
        success: false,
        message: "Expenses cannot exceed the total budget",
      });
    }

    const code = String(destinationCode).trim().toUpperCase();

    // 1) Preferred match: same user + same destination code.
    let doc = await Budget.findOne({ user: req.user._id, destinationCode: code });

    // 2) Legacy match: budgets saved before destinationCode was reliably sent.
    //    Adopt them instead of creating a duplicate for the same destination.
    if (!doc) {
      doc = await Budget.findOne({
        user: req.user._id,
        destination,
        destinationCode: { $in: [null, ""] },
      });
    }

    if (!doc) {
      doc = new Budget({ user: req.user._id });
    }

    doc.destination = destination;
    doc.destinationCode = code;
    doc.currency = String(currency).trim().toUpperCase();
    doc.budget = budget;
    doc.expenses = expenses;

    // totalExpenses / remainingBudget are recomputed by the model's
    // pre("validate") hook, so they always match the expenses above.
    await doc.save();

    res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      data: serializeBudget(doc),
    });
  } catch (error) {
    console.error("Save budget error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save budget",
    });
  }
};

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      data: budgets.map(serializeBudget),
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load budgets",
    });
  }
};

const getBudgetByDestination = async (req, res) => {
  try {
    const code = String(req.params.code || "").trim().toUpperCase();

    const budget = await Budget.findOne({
      user: req.user._id,
      destinationCode: code,
    });

    res.status(200).json({
      success: true,
      data: serializeBudget(budget),
    });
  } catch (error) {
    console.error("Get budget error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load budget",
    });
  }
};

const deleteBudget = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete budget",
    });
  }
};

module.exports = {
  saveBudget,
  getBudgets,
  getBudgetByDestination,
  deleteBudget,
};
