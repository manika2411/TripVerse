import { motion } from 'framer-motion'

function Hero() {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-6"
      >
        <p className="uppercase tracking-[6px] text-cyan-300 mb-6">
          Travel Beyond Expectations
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Explore The World
          <br />
          With Tripverse
        </h1>

        <p className="max-w-2xl mx-auto text-slate-300 text-lg mb-8">
          Discover destinations, organize itineraries, manage travel budgets
          and create unforgettable journeys.
        </p>

        <button className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-8 py-4 rounded-full font-semibold transition-all duration-300">
          Start Exploring
        </button>
      </motion.div>
    </section>
  )
}

export default Hero