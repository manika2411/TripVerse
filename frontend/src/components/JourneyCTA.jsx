import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function JourneyCTA() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 md:py-24">
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "65px 65px",
          }}
        />

        {/* Main glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/12 blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.55, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left glow */}
        <motion.div
          className="absolute left-[10%] top-[30%] h-48 w-48 rounded-full bg-blue-500/8 blur-[100px]"
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Right glow */}
        <motion.div
          className="absolute right-[10%] bottom-[20%] h-48 w-48 rounded-full bg-cyan-400/12 blur-[100px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Orbit */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.10]"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Orbit 2 */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/[0.08]"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          {/* Label */}

          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-cyan-400" />

            <p className="text-xs uppercase tracking-[5px] text-cyan-400">
              Your Next Story Starts Here
            </p>

            <div className="h-px w-10 bg-cyan-400" />
          </div>

          {/* Heading */}

          <h2 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            <span className="text-slate-950">Don't Just</span>

            <br />

            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Travel.
            </span>

            <br />

            <span className="text-slate-950">Experience.</span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            Discover places, build unforgettable itineraries, and turn your next
            journey into a story worth telling.
          </p>

          {/* Buttons */}

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/explore">
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 35px rgba(34,211,238,0.25)",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="group flex items-center gap-3 rounded-full bg-cyan-400 px-8 py-4 font-bold text-slate-950 transition-colors duration-300 hover:bg-cyan-500"
              >
                Start Exploring
                <span className="text-xl transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </motion.div>
            </Link>

            <Link to="/planner">
              <motion.div
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="rounded-full border border-slate-300 px-8 py-4 font-semibold text-slate-700 transition-all duration-300 hover:border-cyan-400/60 hover:text-cyan-600"
              >
                Build My Trip
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* ================= PARTICLES ================= */}

        {[...Array(10)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-cyan-500"
            style={{
              left: `${8 + index * 9}%`,
              top: `${20 + (index % 5) * 15}%`,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [0.15, 0.7, 0.15],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 3 + index * 0.3,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default JourneyCTA;
