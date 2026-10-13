import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buttonPress, cardHover, fadeUp, listItem, pageTransition } from "../utils/animations";
import { useNavigate } from "react-router-dom";
import { getRecommendations } from "../services/recommendationService";

const preferenceOptions = {
  form_a: {
    label: "Age group",
    options: ["0-19", "20-39", "40-59", "60+"],
  },
  form_b: {
    label: "Budget preference",
    options: ["$0-$49", "$50-$99", "$100-$249", "$300+"],
  },
  form_c: {
    label: "Preferred season",
    options: ["Winter", "Spring", "Summer", "Fall"],
  },
  form_h: {
    label: "Travel pace",
    options: ["Chill & Relaxed", "Balanced", "Active"],
  },
  form_i: {
    label: "Safety preference",
    options: [
      "Very Safety Conscious",
      "Balanced",
      "Ready for Anything",
    ],
  },
  form_j: {
    label: "Destination style",
    options: [
      "Off the Beaten Path",
      "Classic Spot",
      "Mainstream & Trendy",
    ],
  },
  form_r: {
    label: "Regional preference",
    options: ["Anywhere", "Specific Regions"],
  },
};

const activityOptions = [
  "Beach",
  "Adventure",
  "Nature",
  "Culture",
  "Nightlife",
  "History",
  "Shopping",
  "Cuisine",
];

const landscapeOptions = [
  "Urban",
  "Rural",
  "Sea",
  "Mountain",
  "Lake",
  "Desert",
  "Plains",
  "Jungle",
];

const regionOptions = [
  "Europe",
  "N. America",
  "Caribbean",
  "Asia",
  "S. America",
  "Mid. East",
  "Africa",
  "Oceania",
];

const initialPreferences = {
  form_a: "20-39",
  form_b: "$50-$99",
  form_c: "Summer",
  form_f: ["Adventure", "Nature"],
  form_g: ["Mountain"],
  form_h: "Active",
  form_i: "Balanced",
  form_j: "Classic Spot",
  form_r: "Anywhere",
  form_rr: ["Asia"],
};

function PreferenceSelect({ field, value, onChange, index }) {
  const config = preferenceOptions[field];

  return (
    <motion.label
      {...listItem(index)}
      className="group block"
    >
      <span className="mb-2 block text-sm font-semibold text-slate-700 transition-colors group-focus-within:text-cyan-700">
        {config.label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full cursor-pointer rounded-xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition duration-300 hover:border-cyan-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
      >
        {config.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </motion.label>
  );
}

function MultiSelectGroup({ title, options, selected, onChange }) {
  const toggleOption = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  };

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-slate-700">
        {title}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <motion.button
              key={option}
              type="button"
              aria-pressed={active}
              {...buttonPress}
              onClick={() => toggleOption(option)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                active
                  ? "border-cyan-600 bg-cyan-600 text-white shadow-md shadow-cyan-600/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              }`}
            >
              {active && <span className="mr-1.5">✓</span>}
              {option}
            </motion.button>
          );
        })}
      </div>
    </fieldset>
  );
}

function RecommendationCard({ recommendation, index }) {
  const destinationName = recommendation.destination.split(",")[0];

  return (
    <motion.article
      layout
      {...listItem(index)}
      exit={{ opacity: 0, y: 12 }}
      whileHover={cardHover.whileHover}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-shadow duration-300 hover:border-cyan-200 hover:shadow-xl hover:shadow-slate-200/70"
    >
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-100 via-sky-50 to-indigo-100">
        <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/70" />

        <div aria-hidden="true" className="absolute -bottom-14 -left-6 h-36 w-36 rounded-full border border-white/70" />

        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/70 bg-white/70 text-4xl shadow-lg shadow-sky-900/5 backdrop-blur-sm">
          ✈️
        </div>

        <span className="absolute left-3 top-3 rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
          #{index + 1} Pick
        </span>

        <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          {Number(recommendation.matchScore || 0).toFixed(1)} match score
        </span>
      </div>

      <div className="p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
          {recommendation.country}
        </p>

        <h3 className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-cyan-700">
          {destinationName}
        </h3>

        <p className="mt-1 line-clamp-1 text-sm text-slate-500">
          {recommendation.destination}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            ML recommendation
          </span>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-700">
            Explore
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              →
            </motion.span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function LoadingState() {
  return (
    <motion.div {...pageTransition} className="py-16 text-center">
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-500" />

        <span className="text-2xl">✈️</span>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-slate-900">
        Finding your next adventure
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Matching your preferences with destinations around the world...
      </p>
    </motion.div>
  );
}

export default function Recommendations() {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState(initialPreferences);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const updatePreference = (field, value) => {
    setPreferences((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setHasSearched(true);
    setRecommendations([]);

    try {
      const results = await getRecommendations({
        ...preferences,
        top_k: 10,
      });

      setRecommendations(results);
    } catch (err) {
      setError(err.message || "Unable to generate recommendations.");

      if (
        /log in|session has expired|unauthorized|token/i.test(
          err.message || ""
        )
      ) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-light-page overflow-hidden px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-[35%] h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.header {...pageTransition} className="mb-9">
          <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
            Your journey, personalized
          </p>

          <h1 className="mt-2 text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            Find Your Next
            <span className="block bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Adventure
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Tell us how you like to travel. Discover destinations ranked
            around your preferences, travel style, and interests.
          </p>
        </motion.header>

        <motion.form
          onSubmit={handleSubmit}
          {...fadeUp}
          className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                Step 01
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                Your travel preferences
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose what matters most for your next trip.
              </p>
            </div>

            <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              Personalized discovery
            </span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.keys(preferenceOptions).map((field, index) => (
              <PreferenceSelect
                key={field}
                field={field}
                value={preferences[field]}
                index={index}
                onChange={(value) => updatePreference(field, value)}
              />
            ))}
          </div>

          <div className="my-9 border-t border-slate-100" />

          <div className="grid gap-9 lg:grid-cols-2">
            <MultiSelectGroup
              title="Activities you're interested in"
              options={activityOptions}
              selected={preferences.form_f}
              onChange={(value) => updatePreference("form_f", value)}
            />

            <MultiSelectGroup
              title="Preferred landscapes"
              options={landscapeOptions}
              selected={preferences.form_g}
              onChange={(value) => updatePreference("form_g", value)}
            />

            <div className="lg:col-span-2">
              <MultiSelectGroup
                title="Preferred regions"
                options={regionOptions}
                selected={preferences.form_rr}
                onChange={(value) => updatePreference("form_rr", value)}
              />

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Select multiple regions if you like, or clear all selections
                to explore destinations without a regional restriction.
              </p>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-4 border-t border-slate-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-5 text-slate-500">
              Recommendations are ranked model predictions, not guarantees
              that you will like a destination.
            </p>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? undefined : { scale: 1.025, y: -2 }}
              whileTap={loading ? undefined : { scale: 0.97 }}
              className="inline-flex min-w-56 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-sky-600 px-7 py-4 font-semibold text-white shadow-lg shadow-cyan-600/20 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  Finding destinations...
                </>
              ) : (
                <>
                  Find my destinations
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                    }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              role="alert"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mt-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
            >
              <p className="font-semibold">We couldn't find your destinations</p>
              <p className="mt-1">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              exit={{ opacity: 0, y: -10 }}
            >
              <LoadingState />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!loading && recommendations.length > 0 && (
            <motion.section
              key="results"
              {...pageTransition}
              exit={{ opacity: 0, y: 15 }}
              className="mt-14"
            >
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
                    Step 02 · Your results
                  </p>

                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                    Destinations picked for you
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Ranked using your selected travel preferences.
                  </p>
                </div>

                <span className="w-fit rounded-full border border-cyan-100 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-800 shadow-sm">
                  {recommendations.length} destinations found
                </span>
              </div>

              <motion.div
                layout
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence>
                  {recommendations.map((recommendation, index) => (
                    <RecommendationCard
                      key={recommendation.destinationId}
                      recommendation={recommendation}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                Match scores are relative to this result set and are not
                probabilities.
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!loading &&
            hasSearched &&
            !error &&
            recommendations.length === 0 && (
              <motion.div
                key="empty"
                {...pageTransition}
                exit={{ opacity: 0, y: 12 }}
                className="mt-10 rounded-3xl border border-slate-200 bg-white/85 px-6 py-12 text-center shadow-sm backdrop-blur-sm"
              >
                <div className="text-5xl">🧭</div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Your next adventure is still out there
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try adjusting your preferences or selecting more regions
                  to discover additional destinations.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    updatePreference("form_rr", [])
                  }
                  className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
                >
                  Explore all regions
                </button>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </main>
  );
}