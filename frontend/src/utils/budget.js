// Single source of truth for budget categories and expense maths, shared by the
// Budget Planner, the Dashboard and the edit dialog.

export const CATEGORIES = [
  { key: "accommodation", label: "Accommodation" },
  { key: "food", label: "Food & Dining" },
  { key: "transport", label: "Transport" },
  { key: "activities", label: "Activities" },
  { key: "shopping", label: "Shopping" },
  { key: "other", label: "Other" },
];

export const emptyExpenses = () =>
  CATEGORIES.reduce((all, { key }) => ({ ...all, [key]: "" }), {});

// Stored numbers -> form strings (0 becomes "" so the placeholder shows).
export const expensesToInputs = (expenses = {}) =>
  CATEGORIES.reduce(
    (all, { key }) => ({
      ...all,
      [key]: expenses?.[key] ? String(expenses[key]) : "",
    }),
    {},
  );

// Form strings -> clean numbers for the API.
export const inputsToExpenses = (inputs = {}) =>
  CATEGORIES.reduce(
    (all, { key }) => ({ ...all, [key]: Number(inputs[key]) || 0 }),
    {},
  );

export const sumExpenses = (expenses = {}) =>
  CATEGORIES.reduce((sum, { key }) => sum + (Number(expenses?.[key]) || 0), 0);
