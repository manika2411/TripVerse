import { motion } from "framer-motion";
import { FaCompass, FaMapMarkedAlt, FaWallet } from "react-icons/fa";

function About() {
  const features = [
    {
      icon: FaCompass,
      title: "Discover",
      text: "Explore destinations and find places that match the way you want to travel.",
    },
    {
      icon: FaMapMarkedAlt,
      title: "Plan",
      text: "Turn ideas into structured itineraries with activities, dates and destinations.",
    },
    {
      icon: FaWallet,
      title: "Manage",
      text: "Keep your travel plans and estimated budgets organized in one place.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-24 pt-32 sm:px-8 md:px-10 md:pt-36">
      <div className="trip-grid pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <motion.section
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-cyan-600 sm:text-sm sm:tracking-[0.5em]">
            About TripVerse
          </p>

          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl md:text-7xl lg:text-8xl">
            Travel Beyond
            <span className="trip-gradient-text mt-2 block">
              Expectations.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8 md:text-xl">
            TripVerse is a modern travel planning platform built around
            destination discovery, itinerary organization, budget planning and
            immersive travel experiences.
          </p>
        </motion.section>

        <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={{ y: -7 }}
                className="trip-card rounded-3xl p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/50 sm:p-8 md:rounded-[32px]"
              >
                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-xl text-cyan-600"
                >
                  <Icon />
                </motion.div>

                <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
                  {feature.title}
                </h2>

                <p className="mt-4 leading-7 text-slate-500">
                  {feature.text}
                </p>
              </motion.article>
            );
          })}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mt-16 min-h-[420px] w-full overflow-hidden rounded-[32px] shadow-2xl shadow-slate-900/10 sm:mt-20 sm:rounded-[40px] md:min-h-[480px]"
        >
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=85&w=1800"
            alt="Mountain landscape surrounded by nature"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/25" />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/10" />

          <div className="relative z-10 flex min-h-[420px] items-center px-6 py-12 sm:px-10 sm:py-14 md:min-h-[480px] md:px-16 lg:px-20">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="w-full max-w-3xl"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 sm:text-sm sm:tracking-[0.5em]">
                The idea
              </p>

              <h2 className="max-w-full break-words text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Your next story
                <span className="mt-2 block text-cyan-300">
                  starts here.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                TripVerse brings discovery and planning together so the journey
                feels just as exciting as the destination.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <motion.a
                  href="/explore"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/20 transition-colors hover:bg-cyan-300 sm:text-base"
                >
                  Explore destinations
                  <span aria-hidden="true">→</span>
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default About;