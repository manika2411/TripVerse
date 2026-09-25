import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* BACKGROUND */}

      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
      >
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=2200"
          alt="Tropical beach"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* COLOR OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-b from-[#062238]/55 via-[#06304a]/35 to-[#061827]/95" />

      <div className="absolute inset-0 bg-gradient-to-r from-[#061827]/55 via-transparent to-[#061827]/35" />

      {/* ANIMATED LIGHT */}

      <motion.div
        animate={{
          x: [0, 120, -40, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          w-[420px]
          h-[420px]
          rounded-full
          bg-cyan-300/10
          blur-[100px]
        "
      />

      {/* FLOATING DOTS */}

      {[...Array(8)].map((_, index) => (
        <motion.span
          key={index}
          className="absolute w-2 h-2 rounded-full bg-cyan-200/70"
          style={{
            left: `${10 + index * 11}%`,
            top: `${25 + (index % 4) * 15}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.25, 0.8, 0.25],
          }}
          transition={{
            duration: 3 + index * 0.4,
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      ))}

      {/* CONTENT */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.1,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          z-10
          w-full
          max-w-6xl
          mx-auto
          px-6
          pt-20
          text-center
        "
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "1px" }}
          animate={{
            opacity: 1,
            letterSpacing: "9px",
          }}
          transition={{ duration: 1.3, delay: 0.7 }}
          className="
            text-cyan-200
            uppercase
            font-semibold
            text-sm
            md:text-base
            mb-8
          "
        >
          Travel Beyond Expectations
        </motion.p>

        <h1 className="font-black uppercase leading-[0.82] tracking-[-0.04em]">
          <motion.span
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="
              block
              text-[clamp(4rem,11vw,10rem)]
              text-white
            "
          >
            EXPLORE
          </motion.span>

          <motion.span
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="
              block
              text-[clamp(4rem,11vw,10rem)]
              trip-gradient-text
            "
          >
            DIFFERENT.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="
            max-w-3xl
            mx-auto
            mt-10
            text-slate-100/85
            text-base
            md:text-xl
            leading-8
          "
        >
          Discover destinations, design unforgettable itineraries, manage your
          journey and experience travel beyond the ordinary.
        </motion.p>

        {/* BUTTONS */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="
            flex
            flex-col
            sm:flex-row
            justify-center
            gap-4
            mt-10
          "
        >
          <Link
            to="/explore"
            className="
              trip-button
              px-10
              py-5
              rounded-full
              bg-cyan-400
              text-slate-950
              font-bold
              text-lg
              shadow-[0_15px_50px_rgba(34,211,238,0.25)]
              hover:bg-cyan-300
            "
          >
            Start Exploring
          </Link>

          <Link
            to="/about"
            className="
              px-10
              py-5
              rounded-full
              border
              border-white/25
              bg-white/5
              backdrop-blur-md
              text-white
              font-semibold
              text-lg
              hover:bg-white/10
              hover:border-cyan-300/50
              transition-all
            "
          >
            Discover TripVerse
          </Link>
        </motion.div>
      </motion.div>

      
    </section>
  );
}

export default Hero;
