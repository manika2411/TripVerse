import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getAllCountries,
  getCountryCode,
  getCountryName,
  getCurrencyInfo,
  getCurrencyInfoAsync,
} from "../services/countryApi";
import MoneyInput from "../components/MoneyInput";
import PageLoader from "../components/PageLoader";
import {
  getBudgetByDestination,
  saveBudget as saveBudgetRequest,
} from "../services/budgetApi";
import {
  CATEGORIES,
  emptyExpenses,
  expensesToInputs,
  inputsToExpenses,
  sumExpenses,
} from "../utils/budget";
import { formatMoney } from "../utils/currency";
import {
  alertMotion,
  buttonPress,
  fadeUp,
  listItem,
  pageTransition,
  progressBar,
} from "../utils/animations";

function BudgetPlanner() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [resolvedCurrency, setResolvedCurrency] = useState(null);
  const [budget, setBudget] = useState("");
  const [expenses, setExpenses] = useState(emptyExpenses);
  const [hasSavedBudget, setHasSavedBudget] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Guards against out-of-order responses when the destination changes quickly.
  const selectionRef = useRef(0);

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

  // All derived numbers come from the inputs below, in one place.
  const totalExpenses = useMemo(
    () => sumExpenses(inputsToExpenses(expenses)),
    [expenses],
  );

  const numericBudget = Number(budget) || 0;
  const remainingBudget = numericBudget - totalExpenses;
  const isOverBudget = remainingBudget < 0;
  const expensePercentage =
    numericBudget > 0 ? Math.min(100, (totalExpenses / numericBudget) * 100) : 0;

  const money = (amount) => formatMoney(amount, currency?.code);

  const loadSavedBudget = async (code, requestId) => {
    if (!localStorage.getItem("token")) return;

    try {
      const result = await getBudgetByDestination(code);

      if (requestId !== selectionRef.current) return;

      const saved = result.data;

      if (!saved) return;

      setHasSavedBudget(true);
      setBudget(saved.budget ? String(saved.budget) : "");
      setExpenses(expensesToInputs(saved.expenses));
    } catch (err) {
      // A missing saved budget is normal; don't block the form.
      console.error("Could not load saved budget:", err);
    }
  };

  const handleDestinationChange = async (e) => {
    const code = e.target.value;
    const country = countries.find((item) => getCountryCode(item) === code);
    const requestId = ++selectionRef.current;

    setSelectedCountry(country || null);
    setResolvedCurrency(null);
    setHasSavedBudget(false);
    setBudget("");
    setExpenses(emptyExpenses());
    setError("");
    setMessage("");

    if (!country) return;

    loadSavedBudget(code, requestId);

    // Usually resolves instantly from the country record; only hits the
    // network if the record carries no currency data.
    const info = await getCurrencyInfoAsync(country);

    if (requestId === selectionRef.current) setResolvedCurrency(info);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    if (value !== "" && Number(value) < 0) return;
    setBudget(value);
  };

  const handleExpenseChange = (key, value) => {
    if (value !== "" && Number(value) < 0) return;
    setExpenses((prev) => ({ ...prev, [key]: value }));
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

    if (!currency?.code) {
      setError("We couldn't determine this destination's currency.");
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

      // Shape matches what the backend reads: a nested `expenses` object plus
      // `destinationCode`. Totals are NOT sent; the server derives them from
      // the expenses so they can never disagree.
      const payload = {
        destination: getCountryName(selectedCountry),
        destinationCode: getCountryCode(selectedCountry),
        currency: currency.code,
        budget: numericBudget,
        expenses: inputsToExpenses(expenses),
      };

      await saveBudgetRequest(payload);

      setHasSavedBudget(true);
      setMessage("Budget saved successfully!");
    } catch (err) {
      console.error("Save budget error:", err);
      setError(err.message || "Failed to save budget.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingCountries && countries.length === 0 && !error) {
    return <PageLoader message="Loading destinations..." />;
  }

  return (
    <main className="site-light-page px-6 pb-20 pt-32">
      <div className="pointer-events-none absolute left-0 top-28 h-[450px] w-[450px] rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[550px] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          {...pageTransition}
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
              Plan your trip expenses, track your spending and understand your
              travel budget in local currency.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <p className="text-sm text-slate-500">Remaining Budget</p>
            <p
              className={`mt-2 text-3xl font-black ${
                isOverBudget ? "text-red-500" : "text-cyan-600"
              }`}
            >
              {money(remainingBudget)}
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {(error || message) && (
            <motion.div
              {...alertMotion}
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
            {...fadeUp}
            className="h-fit rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            <h2 className="mb-8 text-2xl font-black text-slate-950">
              Trip Details
            </h2>

            <label
              htmlFor="budget-destination"
              className="mb-3 block text-sm font-bold text-slate-700"
            >
              Destination
            </label>
            <select
              id="budget-destination"
              value={getCountryCode(selectedCountry)}
              onChange={handleDestinationChange}
              disabled={loadingCountries}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingCountries
                  ? "Loading destinations..."
                  : "Select a destination"}
              </option>
              {countries.map((country, index) => {
                const code = getCountryCode(country);
                return (
                  <option key={code || `country-${index}`} value={code}>
                    {getCountryName(country)}
                  </option>
                );
              })}
            </select>

            <div className="mt-8">
              <p className="mb-3 block text-sm font-bold text-slate-700">
                Destination Currency
              </p>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                {currency ? (
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 min-w-12 items-center justify-center rounded-2xl bg-cyan-50 px-3 text-xl font-black text-cyan-600">
                      {currency.symbol}
                    </div>
                    <div>
                      <p className="font-black text-slate-950">
                        {currency.code}
                      </p>
                      <p className="text-sm text-slate-500">{currency.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">
                    {selectedCountry
                      ? "Currency unavailable for this destination"
                      : "Select a destination"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <label
                htmlFor="budget-total"
                className="mb-3 block text-sm font-bold text-slate-700"
              >
                Total Trip Budget
              </label>
              <MoneyInput
                id="budget-total"
                symbol={currency?.symbol}
                value={budget}
                onChange={handleBudgetChange}
                placeholder="Enter your budget"
              />
            </div>

            {selectedCountry && (
              <motion.div
                {...pageTransition}
                className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-5"
              >
                <p className="text-sm text-slate-500">
                  {hasSavedBudget ? "Editing saved budget for" : "Planning for"}
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {getCountryName(selectedCountry)}
                </p>
                {currency && (
                  <p className="mt-1 text-sm font-semibold text-cyan-700">
                    Currency: {currency.code}
                    {currency.symbol !== currency.code && ` · ${currency.symbol}`}
                  </p>
                )}
              </motion.div>
            )}
          </motion.section>

          <motion.section
            {...fadeUp}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-start">
              <div>
                <h2 className="text-2xl font-black text-slate-950">
                  Expense Breakdown
                </h2>
                <p className="mt-2 text-slate-500">
                  Estimate how much you plan to spend in each category.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-right">
                <p className="text-sm text-slate-500">Total Expenses</p>
                <p className="mt-1 text-2xl font-black text-slate-950">
                  {money(totalExpenses)}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {CATEGORIES.map(({ key, label }, index) => {
                const amount = Number(expenses[key]) || 0;
                const percentage =
                  numericBudget > 0
                    ? Math.min(100, (amount / numericBudget) * 100)
                    : 0;

                return (
                  <motion.div key={key} {...listItem(index)}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <label
                        htmlFor={`expense-${key}`}
                        className="text-sm font-bold text-slate-700"
                      >
                        {label}
                      </label>
                      <span className="text-sm font-semibold text-slate-400">
                        {money(amount)}
                      </span>
                    </div>

                    <MoneyInput
                      id={`expense-${key}`}
                      symbol={currency?.symbol}
                      value={expenses[key]}
                      onChange={(e) => handleExpenseChange(key, e.target.value)}
                    />

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        {...progressBar(percentage)}
                        className="h-full rounded-full bg-cyan-400"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <SummaryCard label="Planned Budget" value={money(numericBudget)} />
              <SummaryCard
                label="Total Expenses"
                value={money(totalExpenses)}
                tone="cyan"
              />
              <SummaryCard
                label="Remaining"
                value={money(remainingBudget)}
                tone={isOverBudget ? "red" : "green"}
              />
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl bg-slate-100">
              <div className="flex items-center justify-between px-4 py-3 text-sm font-bold text-slate-600">
                <span>Budget used</span>
                <span>{Math.round(expensePercentage)}%</span>
              </div>
              <motion.div
                {...progressBar(expensePercentage)}
                className={`h-2 rounded-full ${
                  isOverBudget ? "bg-red-400" : "bg-cyan-400"
                }`}
              />
            </div>

            <motion.button
              {...buttonPress}
              onClick={saveBudget}
              disabled={saving || loadingCountries}
              className="mt-8 w-full rounded-2xl bg-slate-950 py-4 font-black text-white transition hover:bg-cyan-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving Budget..."
                : hasSavedBudget
                  ? "Update Budget"
                  : "Save Budget"}
            </motion.button>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value, tone = "neutral" }) {
  const styles = {
    neutral: "bg-slate-50 text-slate-950",
    cyan: "bg-cyan-50 text-slate-950",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className={`rounded-2xl p-5 ${styles[tone]}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

export default BudgetPlanner;
