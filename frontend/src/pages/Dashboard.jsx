import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getDashboardData } from "../services/dashboardApi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Dashboard() {
  const [budgets, setBudgets] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const totalBudget = budgets.reduce(
    (sum, item) => sum + Number(item.budget || 0),
    0,
  );

  const totalExpenses = budgets.reduce(
    (sum, item) => sum + Number(item.totalExpenses || 0),
    0,
  );

  const remainingBudget = budgets.reduce((sum, item) => {
    const budget = Number(item.budget || 0);
    const expenses = Number(item.totalExpenses || 0);

    return (
      sum +
      Number(
        item.remainingBudget !== undefined
          ? item.remainingBudget
          : budget - expenses,
      )
    );
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 pt-28 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full mx-auto mb-5"
          />

          <p className="text-slate-700 font-semibold">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 relative overflow-hidden pt-28 pb-16">
      <div className="absolute top-20 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-80 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-cyan-500 uppercase tracking-[5px] text-sm font-bold">
            TRIPVERSE
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-2">
            Your Dashboard
          </h1>

          <p className="text-slate-500 text-lg mt-4">
            Manage your trips, budgets and travel plans.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 mb-8"
          >
            <p className="font-semibold">Something went wrong</p>

            <p className="text-sm mt-1">{error}</p>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200"
          >
            <p className="text-slate-500 text-sm font-medium">Total Budget</p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-extrabold text-slate-900 mt-2"
            >
              {totalBudget.toLocaleString()}
            </motion.h2>

            <p className="text-slate-400 text-sm mt-2">
              {budgets.length} saved budget
              {budgets.length !== 1 ? "s" : ""}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200"
          >
            <p className="text-slate-500 text-sm font-medium">Total Expenses</p>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-extrabold text-slate-900 mt-2"
            >
              {totalExpenses.toLocaleString()}
            </motion.h2>

            <p className="text-slate-400 text-sm mt-2">
              Planned travel expenses
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200"
          >
            <p className="text-slate-500 text-sm font-medium">
              Remaining Budget
            </p>

            <motion.h2
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl font-extrabold text-emerald-600 mt-2"
            >
              {remainingBudget.toLocaleString()}
            </motion.h2>

            <p className="text-slate-400 text-sm mt-2">
              Available across your budgets
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Saved Budgets
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Your travel budgets
                </p>
              </div>

              <Link
                to="/budget-planner"
                className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-5 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
              >
                Add Budget
              </Link>
            </div>

            {budgets.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">💰</div>

                <p className="text-slate-500">No saved budgets yet.</p>

                <Link
                  to="/budget-planner"
                  className="inline-block mt-4 text-cyan-600 font-semibold"
                >
                  Create your first budget →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget, index) => {
                  const budgetAmount = Number(budget.budget) || 0;

                  const expenses = Number(budget.totalExpenses) || 0;

                  const remaining =
                    budget.remainingBudget !== undefined
                      ? Number(budget.remainingBudget)
                      : budgetAmount - expenses;

                  const percentage =
                    budgetAmount > 0
                      ? Math.min(
                          100,
                          Math.max(0, (expenses / budgetAmount) * 100),
                        )
                      : 0;

                  return (
                    <motion.div
                      key={budget._id || budget.id || index}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.45 + index * 0.1,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      className="border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {budget.destination || "Travel Budget"}
                          </h3>

                          <p className="text-slate-500 text-sm mt-1">
                            Currency: {budget.currency || "N/A"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            {budgetAmount.toLocaleString()}
                          </p>

                          <p className="text-sm text-emerald-600 mt-1">
                            {remaining.toLocaleString()} remaining
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="flex justify-between text-xs text-slate-400 mb-2">
                          <span>Expenses</span>

                          <span>{Math.round(percentage)}%</span>
                        </div>

                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${percentage}%`,
                            }}
                            transition={{
                              duration: 1,
                              delay: 0.6 + index * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full bg-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.45,
            }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">My Trips</h2>

                <p className="text-slate-500 text-sm mt-1">
                  Your saved travel plans
                </p>
              </div>

              <Link
                to="/planner"
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold transition-all hover:-translate-y-1"
              >
                Plan Trip
              </Link>
            </div>

            {trips.length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.7,
                }}
                className="py-12 text-center"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-5xl mb-5"
                >
                  ✈️
                </motion.div>

                <p className="text-slate-500">No trips created yet.</p>

                <Link
                  to="/planner"
                  className="inline-block mt-4 text-cyan-600 font-semibold"
                >
                  Start planning →
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip, index) => {
                  const status = trip.status || "Upcoming";

                  const statusClass =
                    status === "Completed"
                      ? "bg-slate-100 text-slate-600"
                      : status === "Ongoing"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-cyan-100 text-cyan-700";

                  return (
                    <motion.div
                      key={trip._id || trip.id || index}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.5 + index * 0.1,
                      }}
                      whileHover={{
                        y: -4,
                      }}
                      className="border border-slate-200 rounded-2xl p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">
                            {trip.tripName || "Untitled Trip"}
                          </h3>

                          <p className="text-slate-500 text-sm mt-1">
                            {trip.destination || "Destination not specified"}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-500">
                        {trip.startDate && (
                          <span>
                            🗓 {new Date(trip.startDate).toLocaleDateString()}
                          </span>
                        )}

                        {trip.endDate && (
                          <span>
                            → {new Date(trip.endDate).toLocaleDateString()}
                          </span>
                        )}

                        {trip.budget !== undefined && (
                          <span>
                            💰 {Number(trip.budget || 0).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
