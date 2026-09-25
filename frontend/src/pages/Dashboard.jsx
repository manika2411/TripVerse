import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlaneDeparture,
  FaMapMarkedAlt,
  FaGlobeAsia,
  FaWallet,
  FaArrowRight,
  FaPlus,
  FaCompass,
  FaCalendarAlt,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import { getTrips } from "../services/tripService";

function AnimatedNumber({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();
        setTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const upcomingTrips = trips.filter((trip) => trip.status === "Upcoming");

  const completedTrips = trips.filter((trip) => trip.status === "Completed");

  const totalBudget = trips.reduce(
    (total, trip) => total + Number(trip.budget || 0),
    0,
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-cyan-400 mx-auto mb-5"
          />

          <p className="text-slate-500 font-medium">
            Preparing your journey...
          </p>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Total Trips",
      value: trips.length,
      icon: FaGlobeAsia,
    },
    {
      label: "Upcoming",
      value: upcomingTrips.length,
      icon: FaPlaneDeparture,
    },
    {
      label: "Completed",
      value: completedTrips.length,
      icon: FaMapMarkedAlt,
    },
    {
      label: "Planned Budget",
      value: `$${totalBudget.toLocaleString()}`,
      icon: FaWallet,
    },
  ];

  return (
    <main className="relative min-h-screen bg-slate-50 pt-28 pb-24 px-5 sm:px-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-100/60 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-[1450px] mx-auto">
        {/* HERO */}

        <motion.section
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-cyan-400 via-cyan-300 to-sky-300 p-8 md:p-12 mb-8 shadow-xl shadow-cyan-100"
        >
          {/* Decorative circles */}

          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/20 blur-xl" />

          <div className="absolute right-20 bottom-[-100px] w-60 h-60 rounded-full bg-white/10" />

          {/* Plane */}

          <motion.div
            animate={{
              x: [0, 12, 0],
              y: [0, -8, 0],
              rotate: [0, 3, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-10 md:right-24 top-12 text-white/60 text-7xl hidden md:block"
          >
            ✈
          </motion.div>

          <div className="relative z-10 max-w-3xl">
            <p className="uppercase tracking-[5px] text-cyan-900/60 text-sm font-bold">
              Your Journey
            </p>

            <h1 className="text-4xl md:text-6xl font-black text-slate-950 mt-4 leading-tight">
              Welcome,
              <span className="block text-white">
                {user?.name || "Traveler"}.
              </span>
            </h1>

            <p className="text-slate-800/70 text-lg md:text-xl mt-5 max-w-2xl">
              Everything about your travel plans, in one beautiful place.
            </p>

            <Link
              to="/trip-planner"
              className="inline-flex items-center gap-3 mt-8 bg-slate-950 text-white px-7 py-4 rounded-full font-bold hover:bg-slate-800 hover:scale-105 transition-all duration-300"
            >
              <FaPlus />
              Plan a new trip
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </motion.section>

        {/* STATS */}

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -6,
                }}
                className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center text-lg">
                    <Icon />
                  </div>

                  <span className="text-xs font-bold text-slate-300">
                    0{index + 1}
                  </span>
                </div>

                <p className="text-slate-500 mt-6 text-sm font-medium">
                  {stat.label}
                </p>

                <h2 className="text-3xl font-black text-slate-900 mt-1">
                  <AnimatedNumber value={stat.value} />
                </h2>
              </motion.div>
            );
          })}
        </section>

        {/* QUICK ACTIONS */}

        <section className="mb-14">
          <div className="mb-6">
            <p className="text-cyan-500 uppercase tracking-[4px] text-xs font-bold">
              Explore TripVerse
            </p>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
              What would you like to do?
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* PLAN */}

            <Link
              to="/trip-planner"
              className="group relative overflow-hidden rounded-[30px] bg-slate-950 text-white p-8 min-h-[230px] flex flex-col justify-between shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute -right-16 -top-16 w-52 h-52 bg-cyan-400/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />

              <FaPlaneDeparture className="text-3xl text-cyan-300 relative z-10" />

              <div className="relative z-10">
                <h3 className="text-3xl font-black">Plan a Trip</h3>

                <p className="text-slate-400 mt-2">
                  Build your next unforgettable itinerary.
                </p>

                <span className="inline-flex items-center gap-2 mt-6 text-cyan-300 font-semibold group-hover:gap-4 transition-all">
                  Start planning
                  <FaArrowRight />
                </span>
              </div>
            </Link>

            {/* EXPLORE */}

            <Link
              to="/explore"
              className="group relative overflow-hidden rounded-[30px] bg-white border border-slate-200 p-8 min-h-[230px] flex flex-col justify-between shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute right-[-40px] top-[-40px] w-40 h-40 rounded-full bg-cyan-50 group-hover:scale-150 transition-transform duration-700" />

              <FaCompass className="text-3xl text-cyan-500 relative z-10" />

              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900">Explore</h3>

                <p className="text-slate-500 mt-2">
                  Discover destinations around the world.
                </p>

                <span className="inline-flex items-center gap-2 mt-6 text-cyan-500 font-semibold group-hover:gap-4 transition-all">
                  Browse destinations
                  <FaArrowRight />
                </span>
              </div>
            </Link>

            {/* BUDGET */}

            <Link
              to="/budget"
              className="group relative overflow-hidden rounded-[30px] bg-white border border-slate-200 p-8 min-h-[230px] flex flex-col justify-between shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute right-[-40px] bottom-[-40px] w-44 h-44 rounded-full bg-amber-50 group-hover:scale-150 transition-transform duration-700" />

              <FaWallet className="text-3xl text-amber-500 relative z-10" />

              <div className="relative z-10">
                <h3 className="text-3xl font-black text-slate-900">Budget</h3>

                <p className="text-slate-500 mt-2">
                  Plan your travel spending with ease.
                </p>

                <span className="inline-flex items-center gap-2 mt-6 text-amber-500 font-semibold group-hover:gap-4 transition-all">
                  Calculate budget
                  <FaArrowRight />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* RECENT TRIPS */}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
            <div>
              <p className="text-cyan-500 uppercase tracking-[4px] text-xs font-bold">
                Your plans
              </p>

              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
                Recent Trips
              </h2>
            </div>

            {trips.length > 0 && (
              <Link
                to="/my-trips"
                className="inline-flex items-center gap-2 text-cyan-500 font-semibold hover:gap-3 transition-all"
              >
                View all
                <FaArrowRight className="text-sm" />
              </Link>
            )}
          </div>

          {/* EMPTY STATE */}

          {trips.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="bg-white border border-slate-200 rounded-[32px] p-12 md:p-16 text-center shadow-sm"
            >
              <div className="w-20 h-20 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center text-3xl mx-auto">
                ✈
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mt-7">
                Your journey starts here.
              </h3>

              <p className="text-slate-500 mt-3">
                You haven't created any trips yet.
              </p>

              <Link
                to="/trip-planner"
                className="inline-flex items-center gap-2 mt-7 px-7 py-3 rounded-full bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 hover:scale-105 transition-all"
              >
                <FaPlus />
                Create Your First Trip
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {trips.slice(0, 3).map((trip, index) => (
                <motion.div
                  key={trip._id}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    y: -7,
                  }}
                  className="bg-white border border-slate-200 rounded-[30px] p-7 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <span className="inline-block text-cyan-500 text-xs uppercase tracking-wider font-bold">
                        {trip.status || "Upcoming"}
                      </span>

                      <h3 className="text-2xl font-bold text-slate-900 mt-2">
                        {trip.tripName || "Untitled Trip"}
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-500 flex items-center justify-center shrink-0">
                      <FaPlaneDeparture />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <p className="text-slate-600 flex items-center gap-3">
                      <FaGlobeAsia className="text-cyan-400" />
                      {trip.destination}
                    </p>

                    <p className="text-slate-500 text-sm flex items-center gap-3">
                      <FaCalendarAlt className="text-slate-400" />

                      {trip.startDate
                        ? new Date(trip.startDate).toLocaleDateString()
                        : "Date not set"}

                      <span>→</span>

                      {trip.endDate
                        ? new Date(trip.endDate).toLocaleDateString()
                        : "Date not set"}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-slate-400 text-xs uppercase tracking-wider">
                      Budget
                    </p>

                    <p className="text-xl font-bold text-slate-900 mt-1">
                      ${Number(trip.budget || 0).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
