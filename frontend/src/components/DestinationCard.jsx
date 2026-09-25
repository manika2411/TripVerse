import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function DestinationCard({
  destination,
  large = false,
  index = 0,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={large ? 'h-[620px]' : 'h-[295px]'}
    >
      <Link
        to={`/destination/${destination.id}`}
        className="
          group
          relative
          block
          w-full
          h-full
          overflow-hidden
          rounded-[34px]
          border
          border-white/10
          bg-[#0a2538]
        "
      >
        {/* IMAGE */}

        <motion.img
          src={destination.image}
          alt={destination.name}
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
          whileHover={{
            scale: 1.08,
          }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#03101d]
            via-[#03101d]/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#061827]/40
            to-transparent
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-700
          "
        />

        {/* NUMBER */}

        <div
          className="
            absolute
            top-6
            left-6
            w-14
            h-14
            rounded-full
            bg-white/10
            border
            border-white/20
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-sm
            font-bold
            text-white
          "
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* ARROW */}

        <motion.div
          whileHover={{
            rotate: 45,
          }}
          className="
            absolute
            top-6
            right-6
            w-12
            h-12
            rounded-full
            bg-black/20
            border
            border-white/20
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-cyan-200
          "
        >
          ↗
        </motion.div>

        {/* CONTENT */}

        <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">

          <p className="text-cyan-200 text-sm uppercase tracking-[4px] mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Discover
          </p>

          <h3
            className={`
              font-black
              tracking-tight
              ${large ? 'text-5xl md:text-6xl' : 'text-3xl'}
            `}
          >
            {destination.name}
          </h3>

          <p className="mt-2 text-slate-200/75 text-lg">
            {destination.country}
          </p>

          <div className="h-px w-0 group-hover:w-24 bg-cyan-300 mt-5 transition-all duration-700" />
        </div>
      </Link>
    </motion.div>
  )
}

export default DestinationCard