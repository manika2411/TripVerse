import { motion } from "framer-motion";
import {
  FaMountain,
  FaUmbrellaBeach,
  FaCompass,
  FaGem,
  FaTree,
  FaRoute,
} from "react-icons/fa";

const categories = [
  {
    title: "Adventure",
    description: "Push your limits and collect stories.",
    icon: FaCompass,
    number: "01",
    gradient: "from-orange-500/10 to-cyan-400/5",
  },
  {
    title: "Mountains",
    description: "Find altitude, silence and new perspectives.",
    icon: FaMountain,
    number: "02",
    gradient: "from-sky-500/10 to-cyan-400/5",
  },
  {
    title: "Luxury",
    description: "Travel beautifully and experience more.",
    icon: FaGem,
    number: "03",
    gradient: "from-violet-500/10 to-cyan-400/5",
  },
  {
    title: "Beaches",
    description: "Slow down where the ocean begins.",
    icon: FaUmbrellaBeach,
    number: "04",
    gradient: "from-blue-500/10 to-cyan-400/5",
  },
  {
    title: "Backpacking",
    description: "Take the long way and collect stories.",
    icon: FaRoute,
    number: "05",
    gradient: "from-emerald-500/10 to-cyan-400/5",
  },
  {
    title: "Nature",
    description: "Reconnect with the world around you.",
    icon: FaTree,
    number: "06",
    gradient: "from-teal-500/10 to-cyan-400/5",
  },
];

function CategorySection() {
  return (
    <section className="relative py-24 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 trip-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1500px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <span className="w-14 h-px bg-cyan-300" />

            <p className="uppercase tracking-[6px] text-cyan-600 text-sm">
              Find Your Vibe
            </p>

            <span className="w-14 h-px bg-cyan-300" />
          </div>

          <h2 className="text-center text-5xl md:text-7xl font-black tracking-tight">
            Explore By
            <span className="trip-gradient-text"> Experience.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.15,
                }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                }}
                className={`
                  group
                  relative
                  min-h-[300px]
                  overflow-hidden
                  rounded-[34px]
                  border
                  border-slate-200
                  bg-gradient-to-br
                  ${category.gradient}
                  bg-white
                  p-8
                  flex
                  flex-col
                  justify-between
                  cursor-pointer
                `}
              >
                {/* GRID */}

                <div className="absolute inset-0 trip-grid opacity-60" />

                {/* BIG NUMBER */}

                <span
                  className="
                  absolute
                  -right-2
                  -top-8
                  text-[150px]
                  leading-none
                  font-black
                  text-slate-900/[0.035]
                  pointer-events-none
                "
                >
                  {category.number}
                </span>

                {/* ICON */}

                <div className="relative z-10 flex items-start justify-between">
                  <span className="text-slate-400 text-sm tracking-[4px]">
                    {category.number}
                  </span>

                  <motion.div
                    whileHover={{
                      rotate: 12,
                      scale: 1.08,
                    }}
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-slate-50
                      border
                      border-slate-200
                      backdrop-blur-md
                      flex
                      items-center
                      justify-center
                      text-cyan-600
                    "
                  >
                    <Icon />
                  </motion.div>
                </div>

                {/* TEXT */}

                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-black mb-3 text-slate-950">
                    {category.title}
                  </h3>

                  <p
                    className="
                    text-slate-500
                    max-w-sm
                    leading-7
                    opacity-0
                    translate-y-3
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition-all
                    duration-500
                  "
                  >
                    {category.description}
                  </p>

                  <div
                    className="
                    mt-5
                    w-0
                    group-hover:w-20
                    h-[2px]
                    bg-cyan-300
                    transition-all
                    duration-700
                  "
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-slate-500 uppercase tracking-[6px] text-xs">
            Your next story starts here
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CategorySection;
