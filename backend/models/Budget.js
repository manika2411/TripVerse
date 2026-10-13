const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    destinationCode: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    expenses: {
      accommodation: {
        type: Number,
        default: 0,
      },
      food: {
        type: Number,
        default: 0,
      },
      transport: {
        type: Number,
        default: 0,
      },
      activities: {
        type: Number,
        default: 0,
      },
      shopping: {
        type: Number,
        default: 0,
      },
      other: {
        type: Number,
        default: 0,
      },
    },

    totalExpenses: {
      type: Number,
      default: 0,
    },

    remainingBudget: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// totalExpenses / remainingBudget are derived values. Recompute them from the
// individual expense fields on every save so they can never drift out of sync.
budgetSchema.pre("validate", function () {
  const e = this.expenses || {};

  this.totalExpenses =
    (Number(e.accommodation) || 0) +
    (Number(e.food) || 0) +
    (Number(e.transport) || 0) +
    (Number(e.activities) || 0) +
    (Number(e.shopping) || 0) +
    (Number(e.other) || 0);

  this.remainingBudget = (Number(this.budget) || 0) - this.totalExpenses;
});

module.exports = mongoose.model("Budget", budgetSchema);
