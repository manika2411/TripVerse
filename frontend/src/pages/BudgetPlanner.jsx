import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getAllCountries, getCountryCode, getCountryName, getCurrencyCode, getCurrencyInfo, getCurrencyInfoAsync, getCurrencySymbol } from "../services/countryApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const categories = [
  "Accommodation",
  "Food & Dining",
  "Transport",
  "Activities",
  "Shopping",
  "Other",
];

const initialExpenses = {
  Accommodation: 0,
  "Food & Dining": 0,
  Transport: 0,
  Activities: 0,
  Shopping: 0,
  Other: 0,
};

function BudgetPlanner() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [resolvedCurrency, setResolvedCurrency] = useState(null);
  const [budget, setBudget] = useState("");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        setError("");
        const data = await getAllCountries();
        const sorted = [...data].sort((a, b) =>
          getCountryName(a).localeCompare(getCountryName(b)),
        );
        setCountries(sorted);
      } catch (err) {
        console.error("Failed to load countries:", err);
        setError(err.message || "Unable to load destinations.");
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  const currency = resolvedCurrency || getCurrencyInfo(selectedCountry);

  const totalExpenses = useMemo(
    () =>
      Object.values(expenses).reduce(
        (sum, value) => sum + Number(value || 0),
        0,
      ),
    [expenses],
  );

  const numericBudget = Number(budget) || 0;
  const remainingBudget = numericBudget - totalExpenses;
  const expensePercentage =
    numericBudget > 0
      ? Math.min(100, (totalExpenses / numericBudget) * 100)
      : 0;

  const handleDestinationChange = async (e) => {
    const code = e.target.value;
    const country = countries.find((item) => getCountryCode(item) === code);

    setSelectedCountry(country || null);
    setResolvedCurrency(null);

    if (country) {
      const info = await getCurrencyInfoAsync(country);
      setResolvedCurrency(info);
    }
  };

  const handleExpenseChange = (category, value) => {
    setExpenses((prev) => ({
      ...prev,
      [category]: Math.max(0, Number(value) || 0),
    }));
  };

  const saveBudget = async () => {
    setError("");
    setMessage("");

    if (!localStorage.getItem("token")) {
      setError("Please login before saving a budget.");
      return;
    }

    if (!selectedCountry) {
      setError("Please select a destination.");
      return;
    }

    if (!numericBudget) {
      setError("Please enter your total trip budget.");
      return;
    }

    if (totalExpenses > numericBudget) {
      setError("Your expenses cannot exceed the total budget.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        destination: getCountryName(selectedCountry),
        currency: getCurrencyCode(selectedCountry),
        currencySymbol: getCurrencySymbol(selectedCountry),
        budget: numericBudget,
        accommodation: Number(expenses.Accommodation) || 0,
        food: Number(expenses["Food & Dining"]) || 0,
        transport: Number(expenses.Transport) || 0,
        activities: Number(expenses.Activities) || 0,
        shopping: Number(expenses.Shopping) || 0,
        other: Number(expenses.Other) || 0,
        totalExpenses,
        remainingBudget,
      };

      const response = await fetch(`${API_URL}/budgets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      let result = {};

      if (text) {
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(`Server returned an invalid response (${response.status})`);
        }
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Failed to save budget");
      }

      setMessage("Budget saved successfully!");
    } catch (err) {
      console.error("Save budget error:", err);
      setError(err.message || "Failed to save budget.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="site-light-page px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute left-0 top-28 h-[450px] w-[450px] rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[550px] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-end"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
              Travel Finance
            </p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
              Budget Planner
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-500">
              Plan your trip expenses, track your spending and understand your travel budget in local currency.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm text-slate-500">Remaining Budget</p>
            <motion.p
              key={remainingBudget}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mt-2 text-3xl font-black ${remainingBudget < 0 ? "text-red-500" : "text-cyan-600"}`}
            >
              {currency?.symbol || "—"} {remainingBudget.toLocaleString()}
            </motion.p>
          </div>
        </motion.div>

        <AnimatePresence>
          {(error || message) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 rounded-2xl border px-5 py-4 ${
                error
                  ? "border-red-200 bg-red-50 text-red-600"
                  : "border-emerald-200 bg-emerald-50 text-emerald-600"
              }`}
            >
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-[500px_1fr]">
          <motion.section
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            <h2 className="mb-8 text-2xl font-black text-slate-950">Trip Details</h2>

            <label className="mb-3 block text-sm font-bold text-slate-700">
              Destination
            </label>
            <select
              value={getCountryCode(selectedCountry)}
              onChange={handleDestinationChange}
              disabled={loadingCountries}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingCountries ? "Loading destinations..." : "Select a destination"}
              </option>
              {countries.map((country, index) => {
                const code = getCountryCode(country) || `country-${index}`;
                return (
                  <option key={code} value={getCountryCode(country)}>
                    {getCountryName(country)}
                  </option>
                );
              })}
            </select>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Destination Currency
              </label>
              <motion.div
                layout
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                {currency ? (
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-2xl font-black text-cyan-600"
                    >
                      {currency.symbol}
                    </motion.div>
                    <div>
                      <p className="font-black text-slate-950">{currency.code}</p>
                      <p className="text-sm text-slate-500">{currency.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">Select a destination</p>
                )}
              </motion.div>
            </div>

            <div className="mt-8">
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Total Trip Budget
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 z-10 -translate-y-1/2 font-black text-cyan-600">
                  {currency?.symbol || "—"}
                </span>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Enter your budget"
                  className="trip-input pl-16"
                />
              </div>
            </div>

            {selectedCountry && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-5"
              >
                <p className="text-sm text-slate-500">Planning for</p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {getCountryName(selectedCountry)}
                </p>
                <p className="mt-1 text-sm font-semibold text-cyan-700">
                  Currency: {getCurrencyCode(selectedCountry)} · {getCurrencySymbol(selectedCountry)}
                </p>
              </motion.div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <h2 className="text-2xl font-black text-slate-950">Expense Breakdown</h2>
                <p className="mt-2 text-slate-500">Estimate how much you plan to spend in each category.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-right">
                <p className="text-sm text-slate-500">Total Expenses</p>
                <motion.p
                  key={totalExpenses}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-1 text-2xl font-black text-slate-950"
                >
                  {currency?.symbol || "—"} {totalExpenses.toLocaleString()}
                </motion.p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {categories.map((category, index) => {
                const value = Number(expenses[category]) || 0;
                const percentage =
                  numericBudget > 0 ? Math.min(100, (value / numericBudget) * 100) : 0;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label className="text-sm font-bold text-slate-700">{category}</label>
                      <span className="text-sm font-semibold text-slate-400">
                        {currency?.symbol || "—"} {value.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 z-10 -translate-y-1/2 font-black text-cyan-600">
                        {currency?.symbol || "—"}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={value}
                        onChange={(e) => handleExpenseChange(category, e.target.value)}
                        className="trip-input pl-12"
                      />
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full bg-cyan-400"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <SummaryCard label="Planned Budget" value={numericBudget} symbol={currency?.symbol} />
              <SummaryCard label="Total Expenses" value={totalExpenses} symbol={currency?.symbol} tone="cyan" />
              <SummaryCard
                label="Remaining"
                value={remainingBudget}
                symbol={currency?.symbol}
                tone={remainingBudget < 0 ? "red" : "green"}
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-100">
              <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-600">
                <span>Budget used</span>
                <span>{Math.round(expensePercentage)}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${expensePercentage}%` }}
                className="h-2 rounded-full bg-cyan-400"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={saveBudget}
              disabled={saving || loadingCountries}
              className="mt-8 w-full rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:bg-cyan-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Budget..." : "Save Budget"}
            </motion.button>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, symbol, tone = "neutral" }) {
  const styles = {
    neutral: "bg-slate-50 text-slate-950",
    cyan: "bg-cyan-50 text-slate-950",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`rounded-2xl p-5 ${styles[tone]}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-black">
        {symbol || "—"} {Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

export default BudgetPlanner;
