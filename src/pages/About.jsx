function About() {
  return (
    <div className="pt-32 px-6 min-h-screen max-w-7xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-bold mb-8">
        About Tripverse
      </h1>

      <p className="text-slate-400 text-lg leading-8 max-w-4xl mb-10">
        Tripverse is a modern travel planning platform designed for explorers,
        adventurers, and travelers who want more than just bookings.
        We focus on immersive destination discovery, itinerary organization,
        budget planning, and unforgettable travel experiences.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Discover
          </h2>

          <p className="text-slate-400 leading-7">
            Explore breathtaking destinations, hidden gems, and curated travel
            experiences from around the world.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Plan
          </h2>

          <p className="text-slate-400 leading-7">
            Organize itineraries, manage travel schedules, and estimate trip
            budgets with a seamless planning experience.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            Experience
          </h2>

          <p className="text-slate-400 leading-7">
            Turn journeys into unforgettable memories through immersive travel
            storytelling and community-driven exploration.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About