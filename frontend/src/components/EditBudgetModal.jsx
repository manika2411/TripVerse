import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import MoneyInput from "./MoneyInput";
import { saveBudget } from "../services/budgetApi";
import {
  getAllCountries,
  getCountryCode,
  getCountryName,
  getCurrencyInfo,
} from "../services/countryApi";
import {
  CATEGORIES,
  expensesToInputs,
  inputsToExpenses,
  sumExpenses,
} from "../utils/budget";
import {
  formatMoney,
  getCurrencySymbolFromCode,
  isValidCurrencyCode,
} from "../utils/currency";
import { alertMotion, buttonPress, ease } from "../utils/animations";

/**
 * Figure out which destination code + currency this budget should be saved
 * under. Budgets saved correctly already have both. Older ones (saved before
 * the fix) may not, so we look the country up by name and repair them.
 */
const initialTarget = (item) => {
  const code = String(item.destinationCode || "").trim().toUpperCase();

  if (code && isValidCurrencyCode(item.currency)) {
    const currencyCode = item.currency.trim().toUpperCase();

    return {
      code,
      currencyCode,
      symbol: getCurrencySymbolFromCode(currencyCode),
    };
  }

  return null;
};

function EditBudgetModal({ item, onClose, onSaved }) {
  const [target, setTarget] = useState(() => initialTarget(item));
  const [resolving, setResolving] = useState(() => !initialTarget(item));
  const [resolveError, setResolveError] = useState("");

  const [budget, setBudget] = useState(item.budget ? String(item.budget) : "");
  const [inputs, setInputs] = useState(() => expensesToInputs(item.expenses));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Legacy budgets: resolve code + currency from the destination name.
  useEffect(() => {
    if (target) return undefined;

    let cancelled = false;

    const resolve = async () => {
      try {
        const countries = await getAllCountries();
        const wanted = String(item.destination || "").trim().toLowerCase();

        const match = countries.find(
          (country) => getCountryName(country).trim().toLowerCase() === wanted,
        );

        const info = match ? getCurrencyInfo(match) : null;
        const code = match ? getCountryCode(match) : "";

        if (cancelled) return;

        if (!match || !code || !info) {
          throw new Error("unresolved");
        }

        setTarget({
          code: String(code).toUpperCase(),
          currencyCode: info.code,
          symbol: info.symbol,
        });
      } catch {
        if (!cancelled) {
          setResolveError(
            "We couldn't determine this destination's currency. Please recreate it from the Budget Planner.",
          );
        }
      } finally {
        if (!cancelled) setResolving(false);
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape closes the dialog; the page behind it stays put while it is open.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [saving, onClose]);

  const numericBudget = Number(budget) || 0;

  const totalExpenses = useMemo(
    () => sumExpenses(inputsToExpenses(inputs)),
    [inputs],
  );

  const remaining = numericBudget - totalExpenses;
  const overBudget = remaining < 0;
  const percentage =
    numericBudget > 0 ? Math.min(100, (totalExpenses / numericBudget) * 100) : 0;

  const money = (amount) => formatMoney(amount, target?.currencyCode);

  const handleInput = (key, value) => {
    if (value !== "" && Number(value) < 0) return;
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError("");

    if (!target) {
      setError("This budget's currency could not be determined.");
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

      const result = await saveBudget({
        destination: item.destination,
        destinationCode: target.code,
        currency: target.currencyCode,
        budget: numericBudget,
        expenses: inputsToExpenses(inputs),
      });

      onSaved(result.data);
    } catch (err) {
      setError(err.message || "Failed to update budget.");
      setSaving(false);
    }
  };

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget && !saving) onClose();
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease }}
      onMouseDown={handleBackdrop}
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-10 backdrop-blur-sm sm:items-center"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-budget-title"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-[#ffffff] p-7 shadow-[0_30px_90px_rgba(15,23,42,0.25)] md:p-9"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
              Edit budget
            </p>
            <h2
              id="edit-budget-title"
              className="mt-2 text-3xl font-black tracking-tight text-slate-950"
            >
              {item.destination || "Travel Budget"}
            </h2>
            {target && (
              <p className="mt-1 text-sm text-slate-500">
                Currency: {target.currencyCode}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <AnimatePresence>
          {(error || resolveError) && (
            <motion.div
              {...alertMotion}
              role="alert"
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600"
            >
              {error || resolveError}
            </motion.div>
          )}
        </AnimatePresence>

        {resolving ? (
          <div className="py-16 text-center text-slate-500">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-500" />
            Checking destination details...
          </div>
        ) : (
          <>
            <div className="mt-7">
              <label
                htmlFor="edit-budget-total"
                className="mb-3 block text-sm font-bold text-slate-700"
              >
                Total Trip Budget
              </label>
              <MoneyInput
                id="edit-budget-total"
                symbol={target?.symbol}
                value={budget}
                onChange={(e) => {
                  if (e.target.value !== "" && Number(e.target.value) < 0) return;
                  setBudget(e.target.value);
                }}
                placeholder="Enter your budget"
                autoFocus
              />
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {CATEGORIES.map(({ key, label }) => (
                <div key={key}>
                  <label
                    htmlFor={`edit-${key}`}
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    {label}
                  </label>
                  <MoneyInput
                    id={`edit-${key}`}
                    symbol={target?.symbol}
                    value={inputs[key]}
                    onChange={(e) => handleInput(key, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Planned</p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {money(numericBudget)}
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-50 p-4">
                <p className="text-xs text-slate-500">Expenses</p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  {money(totalExpenses)}
                </p>
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  overBudget ? "bg-red-50" : "bg-emerald-50"
                }`}
              >
                <p className="text-xs text-slate-500">
                  {overBudget ? "Over budget" : "Remaining"}
                </p>
                <p
                  className={`mt-1 text-xl font-black ${
                    overBudget ? "text-red-500" : "text-emerald-700"
                  }`}
                >
                  {money(Math.abs(remaining))}
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overBudget ? "bg-red-400" : "bg-cyan-400"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-2xl border border-slate-200 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <motion.button
                {...buttonPress}
                type="button"
                onClick={handleSave}
                disabled={saving || !target}
                className="rounded-2xl bg-slate-950 px-8 py-3.5 font-black text-white transition hover:bg-cyan-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export default EditBudgetModal;
