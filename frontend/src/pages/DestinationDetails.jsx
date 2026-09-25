import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { getCountryByCode } from "../services/countryApi";

function DestinationDetails() {
  const { id } = useParams();

  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCountry = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCountryByCode(id);

        setCountry(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load this destination.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCountry();
    }
  }, [id]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f9fc] px-6 pt-32 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="h-[500px] animate-pulse rounded-[40px] bg-slate-200" />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
            <div className="h-32 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !country) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f9fc] px-6">
        <div className="max-w-lg rounded-[30px] border border-slate-200 bg-white p-12 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl">
            🌍
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Destination unavailable
          </h1>

          <p className="mt-4 leading-7 text-slate-500">
            {error || "We could not find this destination."}
          </p>

          <Link
            to="/explore"
            className="mt-8 inline-flex rounded-full bg-slate-900 px-7 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-cyan-600"
          >
            Back to Explore
          </Link>
        </div>
      </main>
    );
  }

  const name = country.name?.common || "Unknown";
  const officialName = country.name?.official || name;

  const capital = country.capital?.[0] || "Not available";

  const region = country.region || "Not available";

  const flag = country.flags?.svg || country.flags?.png;

  const currencies = country.currencies
    ? Object.entries(country.currencies)
    : [];

  return (
    <main className="min-h-screen bg-[#f5f9fc] text-slate-900">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-6 pt-28 pb-16">
        {/* Background glow */}

        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[-100px] top-0 h-[450px] w-[450px] rounded-full bg-blue-300/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl">
          {/* Back */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-600"
            >
              ← Back to Explore
            </Link>
          </motion.div>

          {/* Hero card */}

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="relative mt-8 overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.10)]"
          >
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              {/* LEFT VISUAL */}

              <div className="relative min-h-[420px] overflow-hidden bg-slate-900 lg:min-h-[560px]">
                {flag && (
                  <motion.img
                    initial={{
                      scale: 1.15,
                      opacity: 0,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.2,
                    }}
                    src={flag}
                    alt={`${name} flag`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent" />

                {/* Floating code */}

                <div className="absolute left-7 top-7">
                  <span className="rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-xs font-bold uppercase tracking-[3px] text-white backdrop-blur-xl">
                    {country.cca3 || "TRIP"}
                  </span>
                </div>

                {/* Hero title */}

                <div className="absolute bottom-8 left-8 right-8 text-white md:bottom-10 md:left-10">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[4px] text-cyan-300">
                    Discover
                  </p>

                  <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                    {name}
                  </h1>

                  <p className="mt-3 text-lg text-white/75">{officialName}</p>
                </div>
              </div>

              {/* RIGHT INFO */}

              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
                <p className="text-sm font-bold uppercase tracking-[4px] text-cyan-600">
                  Destination
                </p>

                <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                  Your next
                  <span className="block text-cyan-500">adventure.</span>
                </h2>

                <p className="mt-6 leading-8 text-slate-500">
                  Explore {name}, discover its culture and landscapes, and build
                  an itinerary around your journey.
                </p>

                {/* CTA */}

                <Link
                  to={`/planner?destination=${encodeURIComponent(name)}`}
                  className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-slate-900 px-7 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-500 hover:shadow-cyan-500/20"
                >
                  Plan This Trip
                  <span className="text-lg">→</span>
                </Link>

                <div className="mt-10 h-px bg-slate-100" />

                {/* Quick information */}

                <div className="mt-8 grid grid-cols-2 gap-5">
                  <InfoItem label="Capital" value={capital} icon="📍" />

                  <InfoItem label="Region" value={region} icon="🌎" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          INFORMATION CARDS
      ===================================================== */}

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            <p className="text-sm font-bold uppercase tracking-[4px] text-cyan-600">
              Destination overview
            </p>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Everything you need to know
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* CAPITAL */}

            <InfoCard
              icon="📍"
              title="Capital"
              value={capital}
              description={`Explore the heart of ${name}.`}
            />

            {/* REGION */}

            <InfoCard
              icon="🌎"
              title="Region"
              value={region}
              description={`Discover ${name} and its surrounding region.`}
            />

            {/* CURRENCY */}

            <InfoCard
              icon="💳"
              title="Currency"
              value={
                currencies.length > 0
                  ? currencies
                      .map(([code, currency]) => `${currency.name} (${code})`)
                      .join(", ")
                  : "Information unavailable"
              }
              description="Useful information for planning your travel budget."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPERIENCE SECTION
      ===================================================== */}

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[40px] bg-slate-900 px-8 py-16 text-white md:px-16 md:py-20">
            {/* Animated background */}

            <motion.div
              animate={{
                x: [0, 80, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"
            />

            <motion.div
              animate={{
                x: [0, -60, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
            />

            <div className="relative z-10 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[4px] text-cyan-300">
                Make it yours
              </p>

              <h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Don't just visit {name}.
                <span className="block text-cyan-300">Experience it.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Build a personalized itinerary, organize activities and create a
                journey designed around you.
              </p>

              <Link
                to={`/planner?destination=${encodeURIComponent(name)}`}
                className="mt-9 inline-flex rounded-full bg-cyan-400 px-8 py-4 font-bold text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-[0_15px_40px_rgba(34,211,238,0.25)]"
              >
                Start Planning →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, description }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -7,
      }}
      viewport={{
        once: true,
      }}
      transition={{
        duration: 0.5,
      }}
      className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_15px_45px_rgba(15,23,42,0.05)] transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(15,23,42,0.10)]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
        {icon}
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <h3 className="mt-2 text-xl font-bold text-slate-900">{value}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </motion.div>
  );
}

export default DestinationDetails;
