import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DestinationCard from './DestinationCard'

const destinations = [
  {
    id: 'IDN',
    name: 'Bali',
    country: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=85&w=1400',
  },
  {
    id: 'FRA',
    name: 'Paris',
    country: 'France',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=85&w=1400',
  },
  {
    id: 'JPN',
    name: 'Tokyo',
    country: 'Japan',
    image:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=85&w=1400',
  },
]

function FeaturedDestinations() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">

      <div className="absolute inset-0 trip-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-[1500px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <span className="w-16 h-px bg-cyan-300" />

              <p className="text-cyan-600 uppercase tracking-[5px] text-sm font-semibold">
                Featured Destinations
              </p>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-slate-950">
              Your Next
              <span className="block trip-gradient-text">
                Adventure.
              </span>
            </h2>
          </div>

          <Link
            to="/explore"
            className="
              self-start
              md:self-end
              group
              flex
              items-center
              gap-4
              px-7
              py-4
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-700
              font-semibold
              hover:border-cyan-300
              hover:text-cyan-600
              transition-all
            "
          >
            Explore All Destinations

            <span className="text-cyan-300 transition-transform group-hover:translate-x-2">
              →
            </span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-7">

          <DestinationCard
            destination={destinations[0]}
            large
            index={0}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-7">
            <DestinationCard
              destination={destinations[1]}
              index={1}
            />

            <DestinationCard
              destination={destinations[2]}
              index={2}
            />
          </div>

        </div>
      </div>
    </section>
  )
}

export default FeaturedDestinations