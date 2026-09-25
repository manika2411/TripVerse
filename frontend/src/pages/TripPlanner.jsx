import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlus,
  FaTrash,
  FaPlaneDeparture,
  FaWallet,
} from "react-icons/fa";

import { TravelContext } from "../context/TravelContext";
import { AuthContext } from "../context/AuthContext";
import { createTrip } from "../services/tripService";

function TripPlanner() {
  const navigate = useNavigate();

  const travelContext = useContext(TravelContext);
  const authContext = useContext(AuthContext);

  const selectedDestination = travelContext?.selectedDestination;

  const suggestedActivities = travelContext?.suggestedActivities || [];

  const clearActivities = travelContext?.clearActivities;

  const user = authContext?.user;

  const getDestinationName = (destination) => {
    if (!destination) return "";

    return (
      destination?.name?.common ||
      destination?.names?.common ||
      destination?.name ||
      ""
    );
  };

  const [formData, setFormData] = useState({
    tripName: "",
    destination: getDestinationName(selectedDestination),
    startDate: "",
    endDate: "",
    budget: "",
  });

  const [itinerary, setItinerary] = useState([]);

  const [day, setDay] = useState("");
  const [activity, setActivity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const destinationName = getDestinationName(selectedDestination);

    if (destinationName) {
      setFormData((prev) => ({
        ...prev,
        destination: destinationName,
      }));
    }
  }, [selectedDestination]);

  useEffect(() => {
    if (!suggestedActivities || suggestedActivities.length === 0) {
      return;
    }

    const generatedActivities = suggestedActivities.map((item, index) => ({
      id: `suggested-${Date.now()}-${index}`,
      day: `Day ${index + 1}`,
      activity:
        typeof item === "string"
          ? item
          : item?.name || item?.title || "Travel activity",
    }));

    setItinerary((prev) => {
      const existing = new Set(prev.map((item) => item.activity));

      const unique = generatedActivities.filter(
        (item) => !existing.has(item.activity),
      );

      return [...prev, ...unique];
    });

    if (clearActivities) {
      clearActivities();
    }
  }, [suggestedActivities, clearActivities]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddActivity = (e) => {
    e.preventDefault();

    if (!day.trim() || !activity.trim()) {
      return;
    }

    setItinerary((prev) => [
      ...prev,
      {
        id: `manual-${Date.now()}`,
        day: day.trim(),
        activity: activity.trim(),
      },
    ]);

    setDay("");
    setActivity("");
  };

  const handleDeleteActivity = (id) => {
    setItinerary((prev) => prev.filter((item) => item.id !== id));
  };

  const savePlannerData = () => {
    sessionStorage.setItem(
      "tripversePlannerData",
      JSON.stringify({
        tripName: formData.tripName,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget,
        itinerary,
      }),
    );
  };

  const handleOpenBudgetPlanner = () => {
    savePlannerData();

    navigate("/budget-planner");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.tripName.trim() ||
      !formData.destination.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("Please fill in all required trip details.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!user) {
      savePlannerData();

      navigate("/login?redirect=trip-planner");

      return;
    }

    try {
      setLoading(true);

      const tripData = {
        tripName: formData.tripName.trim(),

        destination: formData.destination.trim(),

        startDate: formData.startDate,

        endDate: formData.endDate,

        budget: Number(formData.budget) || 0,

        itinerary: itinerary.map((item) => ({
          day: item.day,
          activity: item.activity,
        })),
      };

      await createTrip(tripData);

      sessionStorage.removeItem("tripversePlannerData");

      setSuccess("Your trip has been saved successfully.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Create trip error:", err);

      setError(err.message || "Unable to save your trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-24 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mb-12"
        >
          <p className="text-cyan-600 uppercase tracking-[5px] text-sm font-bold">
            Plan Your Journey
          </p>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mt-4">
            Build your trip.
          </h1>

          <p className="text-slate-500 text-lg max-w-2xl mt-5 leading-8">
            Choose where you're going, set your dates and build your itinerary.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-600">
            {success}
          </div>
        )}

        <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <motion.section
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="bg-white rounded-[30px] border border-slate-200 shadow-sm p-7 md:p-9"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <FaPlaneDeparture />
              </div>

              <div>
                <p className="text-sm text-slate-400">Step 01</p>

                <h2 className="text-2xl font-black">Trip Details</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Trip Name
                </label>

                <input
                  type="text"
                  name="tripName"
                  value={formData.tripName}
                  onChange={handleChange}
                  placeholder="Summer in Europe"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Destination
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" />

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" />

                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" />

                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Budget
                </label>

                <div className="relative">
                  <FaMoneyBillWave className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-500" />

                  <input
                    type="number"
                    name="budget"
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="2500"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-50"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenBudgetPlanner}
                className="w-full rounded-2xl border-2 border-cyan-100 bg-cyan-50 text-cyan-700 py-4 font-black flex items-center justify-center gap-3 hover:bg-cyan-100 transition"
              >
                <FaWallet />
                Open Budget Planner
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white py-4 font-black text-lg transition"
              >
                {loading
                  ? "Saving Trip..."
                  : user
                    ? "Save Trip"
                    : "Continue to Login & Save"}
              </button>
            </form>
          </motion.section>

          <div className="space-y-8">
            <motion.section
              initial={{
                opacity: 0,
                x: 25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
              className="bg-white rounded-[30px] border border-slate-200 shadow-sm p-7 md:p-9"
            >
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-cyan-600 font-bold uppercase tracking-[3px]">
                    Step 02
                  </p>

                  <h2 className="text-2xl font-black mt-1">Build Itinerary</h2>
                </div>

                <span className="rounded-full bg-cyan-50 text-cyan-600 px-4 py-2 text-sm font-bold">
                  {itinerary.length}{" "}
                  {itinerary.length === 1 ? "Activity" : "Activities"}
                </span>
              </div>

              <form
                onSubmit={handleAddActivity}
                className="grid md:grid-cols-[150px_1fr_auto] gap-4 items-end"
              >
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Day
                  </label>

                  <input
                    type="text"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="Day 1"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Activity
                  </label>

                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="Visit the Eiffel Tower"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="h-[58px] w-[58px] rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition"
                >
                  <FaPlus />
                </button>
              </form>
            </motion.section>

            <section>
              {itinerary.length === 0 ? (
                <div className="rounded-[30px] border border-dashed border-slate-300 bg-white p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center mx-auto text-2xl">
                    ✈
                  </div>

                  <h3 className="text-xl font-black mt-5">
                    Your itinerary is empty
                  </h3>

                  <p className="text-slate-500 mt-2">
                    Add activities to build your journey.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itinerary.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-5 flex items-center gap-5"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-[2px] text-cyan-600 font-bold">
                          {item.day}
                        </p>

                        <p className="text-lg font-bold text-slate-800 mt-1 break-words">
                          {item.activity}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(item.id)}
                        className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
                      >
                        <FaTrash />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default TripPlanner;
