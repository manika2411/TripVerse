import { motion } from 'framer-motion'
import {
  FaCompass,
  FaGlobeAsia,
  FaUsers,
} from 'react-icons/fa'

function Community() {
  const cards = [
    {
      icon: FaUsers,
      title: 'Travel Together',
      text: 'Connect with travelers and discover new perspectives.',
    },
    {
      icon: FaCompass,
      title: 'Share Journeys',
      text: 'Share itineraries, stories and unforgettable experiences.',
    },
    {
      icon: FaGlobeAsia,
      title: 'Discover More',
      text: 'Find inspiration from destinations around the world.',
    },
  ]

  return (
    <main className="relative min-h-screen pt-36 pb-24 px-6 overflow-hidden">

      <div className="absolute inset-0 trip-grid opacity-30" />

      <div className="relative z-10 max-w-[1300px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-cyan-300 uppercase tracking-[6px] text-sm mb-5">
            The Travel Community
          </p>

          <h1 className="text-6xl md:text-8xl font-black">
            Travel Is Better
            <span className="block trip-gradient-text">
              Together.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-400 text-lg leading-8 mt-7">
            Share stories, discover public itineraries and connect
            with people who are just as curious about the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">

          {cards.map((card, index) => {
            const Icon = card.icon

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -8 }}
                className="
                  trip-card
                  rounded-[32px]
                  p-8
                  min-h-[300px]
                "
              >
                <div className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-cyan-300/10
                  border
                  border-cyan-300/10
                  flex
                  items-center
                  justify-center
                  text-cyan-300
                  text-xl
                  mb-10
                ">
                  <Icon />
                </div>

                <h2 className="text-2xl font-bold">
                  {card.title}
                </h2>

                <p className="text-slate-400 mt-4 leading-7">
                  {card.text}
                </p>

                <div className="mt-8 text-cyan-300">
                  Coming soon →
                </div>
              </motion.div>
            )
          })}

        </div>

      </div>
    </main>
  )
}

export default Community