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
    <main className="relative min-h-screen pt-36 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 trip-grid opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <p className="text-cyan-300 uppercase tracking-[6px] text-sm mb-5">
            About TripVerse
          </p>

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9]">
            Travel Beyond
            <span className="block trip-gradient-text">Expectations.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-8 mt-8 max-w-3xl">
            TripVerse is a modern travel planning platform built around
            destination discovery, itinerary organization, budget planning and
            immersive travel experiences.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                }}
                className="trip-card rounded-[32px] p-8"
              >
                <div
                  className="
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
                "
                >
                  <Icon />
                </div>

                <h2 className="text-2xl font-bold mt-8">{feature.title}</h2>

                <p className="text-slate-400 mt-4 leading-7">{feature.text}</p>
              </motion.div>
            );
          })}
        </div>

        <div
          className="
          mt-20
          rounded-[40px]
          overflow-hidden
          relative
          min-h-[420px]
        "
        >
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=85&w=1800"
            alt="Mountain landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div
            className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#061827]/95
            via-[#061827]/55
            to-transparent
          "
          />

          <div className="relative z-10 p-10 md:p-16 max-w-2xl">
            <p className="text-cyan-300 uppercase tracking-[5px] text-sm">
              The idea
            </p>

            <h2 className="text-4xl md:text-6xl font-black mt-4">
              Your next story
              <span className="block text-cyan-300">starts here.</span>
            </h2>

            <p className="text-slate-300 leading-7 mt-6">
              TripVerse brings discovery and planning together so the journey
              feels just as exciting as the destination.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
