import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCountries, getCountryName, getCurrencyCode, getCurrencyInfoAsync } from "../services/countryApi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function TripPlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    tripName: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    travelStyle: "Balanced",
    interests: [],
  });

  const interestOptions = [
    "Adventure",
    "Beaches",
    "Culture",
    "Food",
    "History",
    "Nature",
    "Nightlife",
    "Shopping",
    "Relaxation",
    "Photography",
  ];

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoadingCountries(true);
        setError("");

        const data = await getAllCountries();

        if (!Array.isArray(data)) {
          throw new Error("Invalid country data received.");
        }

        const sorted = [...data].sort((a, b) => {
          const nameA =
            typeof a.name === "string" ? a.name : a.name?.common || "";

          const nameB =
            typeof b.name === "string" ? b.name : b.name?.common || "";

          return nameA.localeCompare(nameB);
        });

        setCountries(sorted);
      } catch (err) {
        console.error("Destination loading error:", err);
        setError("Unable to load destinations.");
      } finally {
        setLoadingCountries(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const destination = searchParams.get("destination");

    if (!destination || !countries.length || formData.destination) return;

    const match = countries.find(
      (country) => getCountryName(country).toLowerCase() === destination.toLowerCase(),
    );

    if (match) {
      setFormData((prev) => ({
        ...prev,
        destination: getCountryName(match),
      }));
    }
  }, [countries, searchParams, formData.destination]);

  const selectedCountry = useMemo(() => {
    return countries.find((country) => {
      const countryName =
        typeof country.name === "string"
          ? country.name
          : country.name?.common || "";

      return countryName === formData.destination;
    });
  }, [countries, formData.destination]);

  const getCountryCode = (country, index) => {
    return country.cca3 || country.codes?.alpha_3 || country.code || index;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!formData.tripName.trim()) {
      setError("Please enter a trip name.");
      return;
    }

    if (!formData.destination) {
      setError("Please select a destination.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Please select both travel dates.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!formData.budget || Number(formData.budget) <= 0) {
      setError("Please enter a valid budget.");
      return;
    }

    setSaving(true);

    try {
      const currencyInfo = await getCurrencyInfoAsync(selectedCountry);
      const currency = currencyInfo?.code || getCurrencyCode(selectedCountry);

      const response = await fetch(`${API_URL}/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tripName: formData.tripName,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: Number(formData.budget),
          itinerary: [],
          travelers: Number(formData.travelers),
          travelStyle: formData.travelStyle,
          interests: formData.interests,
          currency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create trip.");
      }

      setSuccess("Trip created successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to create trip.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 pt-32 pb-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-cyan-500 uppercase tracking-[5px] text-sm font-bold mb-4">
            Trip Planner
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900">
            Design your next adventure.
          </h1>

          <p className="text-slate-500 text-lg mt-5 max-w-2xl">
            Tell us what you want from your trip and create a personalized
            travel plan.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-600"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-10"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Trip Details
              </h2>

              <div className="space-y-7">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Trip Name
                  </label>

                  <input
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    onChange={handleChange}
                    placeholder="e.g. Summer in Europe"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Destination
                  </label>

                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    disabled={loadingCountries}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                  >
                    <option value="">
                      {loadingCountries
                        ? "Loading destinations..."
                        : "Select a destination"}
                    </option>

                    {countries.map((country, index) => {
                      const name = getCountryName(country);
                      const code = getCountryCode(country, index);

                      return (
                        <option key={code} value={name}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date
                    </label>

                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      End Date
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of Travelers
                    </label>

                    <input
                      type="number"
                      name="travelers"
                      min="1"
                      max="20"
                      value={formData.travelers}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Total Budget
                    </label>

                    <input
                      type="number"
                      name="budget"
                      min="1"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Enter your budget"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Travel Style
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Budget", "Balanced", "Luxury", "Backpacking"].map(
                      (style) => (
                        <motion.button
                          key={style}
                          type="button"
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              travelStyle: style,
                            }))
                          }
                          className={`rounded-2xl px-4 py-4 font-semibold border transition ${
                            formData.travelStyle === style
                              ? "bg-cyan-400 border-cyan-400 text-slate-900"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:border-cyan-300"
                          }`}
                        >
                          {style}
                        </motion.button>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    What are you interested in?
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {interestOptions.map((interest) => {
                      const selected = formData.interests.includes(interest);

                      return (
                        <motion.button
                          key={interest}
                          type="button"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => toggleInterest(interest)}
                          className={`px-4 py-2.5 rounded-full border text-sm font-semibold transition ${
                            selected
                              ? "bg-slate-900 border-slate-900 text-white"
                              : "bg-white border-slate-200 text-slate-600 hover:border-cyan-400"
                          }`}
                        >
                          {interest}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
              }}
              className="space-y-6"
            >
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-900 rounded-3xl p-8 text-white overflow-hidden relative"
              >
                <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-400/20 rounded-full blur-2xl" />

                <p className="text-cyan-400 uppercase tracking-[3px] text-xs font-bold mb-4">
                  Your Journey
                </p>

                <h3 className="text-3xl font-bold">
                  {formData.destination || "Your destination"}
                </h3>

                <p className="text-slate-400 mt-4">
                  {formData.startDate && formData.endDate
                    ? `${formData.startDate} → ${formData.endDate}`
                    : "Choose your travel dates"}
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Travelers</span>

                    <span className="font-semibold">{formData.travelers}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Budget</span>

                    <span className="font-semibold">
                      {formData.budget || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Style</span>

                    <span className="font-semibold">
                      {formData.travelStyle}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  Selected Interests
                </h3>

                {formData.interests.length === 0 ? (
                  <p className="text-slate-400 mt-4">
                    Select interests to personalize your trip.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {formData.interests.map((interest) => (
                      <motion.span
                        key={interest}
                        initial={{
                          opacity: 0,
                          scale: 0.7,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className="px-3 py-2 rounded-full bg-cyan-50 text-cyan-600 text-sm font-semibold"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.button
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 15px 35px rgba(34,211,238,0.25)",
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving || loadingCountries}
                className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 rounded-2xl py-5 font-bold text-lg transition"
              >
                {saving ? "Creating Trip..." : "Create My Trip →"}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripPlanner;
