const Budget = require("../models/Budget");

const calculateExpenses = (expenses = {}) => {
  return (
    (Number(expenses.accommodation) || 0) +
    (Number(expenses.food) || 0) +
    (Number(expenses.transport) || 0) +
    (Number(expenses.activities) || 0) +
    (Number(expenses.shopping) || 0) +
    (Number(expenses.other) || 0)
  );
};

const saveBudget = async (req, res) => {
  try {
    const { destination, destinationCode, currency, budget, expenses } =
      req.body;

    if (!destination || !currency) {
      return res.status(400).json({
        success: false,
        message: "Destination and currency are required",
      });
    }

    const totalExpenses = calculateExpenses(expenses);

    const remainingBudget = Number(budget) - totalExpenses;

    const savedBudget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        destinationCode,
      },
      {
        user: req.user._id,
        destination,
        destinationCode,
        currency,
        budget: Number(budget) || 0,
        expenses: {
          accommodation: Number(expenses?.accommodation) || 0,
          food: Number(expenses?.food) || 0,
          transport: Number(expenses?.transport) || 0,
          activities: Number(expenses?.activities) || 0,
          shopping: Number(expenses?.shopping) || 0,
          other: Number(expenses?.other) || 0,
        },
        totalExpenses,
        remainingBudget,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      data: savedBudget,
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
    const budgets = await Budget.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      data: budgets,
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
    const budget = await Budget.findOne({
      user: req.user._id,
      destinationCode: req.params.code,
    });

    res.status(200).json({
      success: true,
      data: budget,
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
