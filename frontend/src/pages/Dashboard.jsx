import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getDashboardData } from "../services/dashboardApi";
import PageLoader from "../components/PageLoader";
import EditBudgetModal from "../components/EditBudgetModal";
import { deleteBudget } from "../services/budgetApi";
import { sumExpenses } from "../utils/budget";
import { formatMoney, isValidCurrencyCode } from "../utils/currency";
import {
  alertMotion,
  buttonPress,
  cardHover,
  fadeUp,
  listItem,
  pageTransition,
  progressBar,
} from "../utils/animations";

/**
 * Single place where a saved budget becomes display numbers.
 * `used` is always summed from the individual expense fields (falling back to
 * the stored total only for records that have no breakdown), and `remaining`
 * is always budget - used. Nothing is trusted from a stored "remaining" value.
 */
const getBudgetFigures = (item) => {
  const budget = Number(item.budget) || 0;

  const used =
    item.expenses && typeof item.expenses === "object"
      ? sumExpenses(item.expenses)
      : Number(item.totalExpenses) || 0;

  const currency = isValidCurrencyCode(item.currency)
    ? item.currency.trim().toUpperCase()
    : null;

  return { budget, used, remaining: budget - used, currency };
};

function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  const showNotice = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 3500);
  };

  const handleSaved = (updated) => {
    setBudgets((prev) => {
      const exists = prev.some((b) => b._id === updated._id);
      return exists
        ? prev.map((b) => (b._id === updated._id ? updated : b))
        : [updated, ...prev];
    });
    setEditing(null);
    showNotice(`${updated.destination || "Budget"} updated successfully.`);
  };

  const handleDelete = async (item) => {
    try {
      await deleteBudget(item._id);
      setBudgets((prev) => prev.filter((b) => b._id !== item._id));
      showNotice(`${item.destination || "Budget"} deleted.`);
    } catch (err) {
      setError(err.message || "Failed to delete budget.");
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();

        setBudgets(Array.isArray(data.budgets) ? data.budgets : []);
        setTrips(Array.isArray(data.trips) ? data.trips : []);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Totals are kept per currency. Adding 500 MXN to 3,000 EUR would produce a
  // meaningless number, so each currency gets its own line.
  const totalsByCurrency = useMemo(() => {
    const groups = new Map();

    budgets.forEach((item) => {
      const { budget, used, remaining, currency } = getBudgetFigures(item);
      const key = currency || "";
      const group = groups.get(key) || {
        currency,
        budget: 0,
        used: 0,
        remaining: 0,
      };

      group.budget += budget;
      group.used += used;
      group.remaining += remaining;
      groups.set(key, group);
    });

    return [...groups.values()];
  }, [budgets]);

  if (loading) {
    return <PageLoader message="Loading your dashboard..." />;
  }

  return (
    <main className="site-light-page px-6 pb-16 pt-32">
      <div className="pointer-events-none absolute left-0 top-20 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-80 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div {...pageTransition} className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
            TripVerse
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            Your Dashboard
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Manage your trips, budgets and travel plans.
          </p>
        </motion.div>

        {error && (
          <motion.div
            {...alertMotion}
            className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600"
          >
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 text-sm">{error}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {notice && (
            <motion.div
              {...alertMotion}
              role="status"
              className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700"
            >
              {notice}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            index={0}
            label="Total Budget"
            groups={totalsByCurrency}
            field="budget"
            footnote={`${budgets.length} saved budget${budgets.length !== 1 ? "s" : ""}`}
          />
          <StatCard
            index={1}
            label="Total Expenses"
            groups={totalsByCurrency}
            field="used"
            footnote="Planned travel expenses"
          />
          <StatCard
            index={2}
            label="Remaining Budget"
            groups={totalsByCurrency}
            field="remaining"
            footnote="Available across your budgets"
            colorByValue
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.section
            {...fadeUp}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Saved Budgets
                </h2>
                <p className="mt-1 text-sm text-slate-500">Your travel budgets</p>
              </div>

              <motion.div {...buttonPress}>
                <Link
                  to="/budget-planner"
                  className="inline-block rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-900 transition-colors hover:bg-cyan-300"
                >
                  Add Budget
                </Link>
              </motion.div>
            </div>

            {budgets.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-5xl">💰</div>
                <p className="text-slate-500">No saved budgets yet.</p>
                <Link
                  to="/budget-planner"
                  className="mt-4 inline-block font-semibold text-cyan-600"
                >
                  Create your first budget →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((item, index) => (
                  <BudgetCard
                    key={item._id || item.id || index}
                    item={item}
                    index={index}
                    onEdit={() => setEditing(item)}
                    onDelete={() => handleDelete(item)}
                  />
                ))}
              </div>
            )}
          </motion.section>

          <motion.section
            {...fadeUp}
            className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Trips</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your saved travel plans
                </p>
              </div>

              <motion.div {...buttonPress}>
                <Link
                  to="/planner"
                  className="inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition-colors hover:bg-slate-800"
                >
                  Plan Trip
                </Link>
              </motion.div>
            </div>

            {trips.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-5 text-5xl">✈️</div>
                <p className="text-slate-500">No trips created yet.</p>
                <Link
                  to="/planner"
                  className="mt-4 inline-block font-semibold text-cyan-600"
                >
                  Start planning →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip, index) => (
                  <TripCard key={trip._id || trip.id || index} trip={trip} index={index} />
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <EditBudgetModal
            key={editing._id}
            item={editing}
            onClose={() => setEditing(null)}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({ index, label, groups, field, footnote, colorByValue = false }) {
  // With several currencies, each total gets its own line at a smaller size.
  const multiple = groups.length > 1;
  const rows = groups.length > 0 ? groups : [{ currency: null, [field]: 0 }];

  return (
    <motion.div
      {...listItem(index)}
      whileHover={cardHover.whileHover}
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <div className="mt-2 space-y-1">
        {rows.map((group) => {
          const value = group[field];
          const tone = colorByValue
            ? value < 0
              ? "text-red-500"
              : "text-emerald-600"
            : "text-slate-900";

          return (
            <p
              key={group.currency || "unknown"}
              className={`font-extrabold ${tone} ${
                multiple ? "text-2xl" : "text-4xl"
              }`}
            >
              {formatMoney(value, group.currency)}
              {multiple && !group.currency && (
                <span className="ml-2 text-xs font-semibold text-slate-400">
                  (currency unknown)
                </span>
              )}
            </p>
          );
        })}
      </div>

      <p className="mt-2 text-sm text-slate-400">{footnote}</p>
    </motion.div>
  );
}

function BudgetCard({ item, index, onEdit, onDelete }) {
  const { budget, used, remaining, currency } = getBudgetFigures(item);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const overspent = remaining < 0;

  const percentage =
    budget > 0 ? Math.min(100, Math.max(0, (used / budget) * 100)) : 0;

  return (
    <motion.div
      {...listItem(index)}
      whileHover={cardHover.whileHover}
      className="rounded-2xl border border-slate-200 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {item.destination || "Travel Budget"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Currency: {currency || "Unknown"}
          </p>
          {!currency && (
            <p className="mt-1 text-xs text-amber-600">
              Re-save this budget in the planner to fix its currency.
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="font-bold text-slate-900">{formatMoney(budget, currency)}</p>
          <p
            className={`mt-1 text-sm ${
              overspent ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {overspent
              ? `${formatMoney(Math.abs(remaining), currency)} over budget`
              : `${formatMoney(remaining, currency)} remaining`}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-400">
          <span>
            Spent {formatMoney(used, currency)} of {formatMoney(budget, currency)}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            {...progressBar(percentage, 0.2 + Math.min(index, 8) * 0.06)}
            className={`h-full rounded-full ${
              overspent ? "bg-red-400" : "bg-cyan-400"
            }`}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
        {confirmingDelete ? (
          <>
            <span className="mr-auto text-sm text-slate-500">
              Delete this budget?
            </span>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Keep
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                await onDelete();
                setDeleting(false);
                setConfirmingDelete(false);
              }}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Yes, delete"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-500"
            >
              Delete
            </button>
            <motion.button
              {...buttonPress}
              type="button"
              onClick={onEdit}
              className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-cyan-500 hover:text-slate-950"
            >
              Edit
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function TripCard({ trip, index }) {
  const status = trip.status || "Upcoming";

  const statusClass =
    status === "Completed"
      ? "bg-slate-100 text-slate-600"
      : status === "Ongoing"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-cyan-100 text-cyan-700";

  return (
    <motion.div
      {...listItem(index)}
      whileHover={cardHover.whileHover}
      className="rounded-2xl border border-slate-200 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {trip.tripName || "Untitled Trip"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {trip.destination || "Destination not specified"}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
        {trip.startDate && (
          <span>🗓 {new Date(trip.startDate).toLocaleDateString()}</span>
        )}
        {trip.endDate && (
          <span>→ {new Date(trip.endDate).toLocaleDateString()}</span>
        )}
        {trip.budget !== undefined && (
          <span>💰 {Number(trip.budget || 0).toLocaleString()}</span>
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;
