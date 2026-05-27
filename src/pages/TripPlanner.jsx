import {
  useContext,
  useEffect,
  useState,
} from 'react'

import { TravelContext } from '../context/TravelContext'

function TripPlanner() {
  const { selectedDestination } =
    useContext(TravelContext)

  const [tripName, setTripName] = useState('')

  const [destination, setDestination] =
    useState(
      selectedDestination?.name?.common || ''
    )

  const [day, setDay] = useState('')

  const [activity, setActivity] = useState('')

  const [plans, setPlans] = useState([])

  // Load saved plans
  useEffect(() => {
    const savedPlans =
      localStorage.getItem('tripPlans')

    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    }
  }, [])

  // Save plans
  useEffect(() => {
    localStorage.setItem(
      'tripPlans',
      JSON.stringify(plans)
    )
  }, [plans])

  // Update destination dynamically
  useEffect(() => {
    if (selectedDestination) {
      setDestination(
        selectedDestination.name.common
      )
    }
  }, [selectedDestination])

  const handleAddPlan = (e) => {
    e.preventDefault()

    if (!destination || !day || !activity)
      return

    const newPlan = {
      id: Date.now(),
      tripName,
      destination,
      day,
      activity,
    }

    setPlans([...plans, newPlan])

    setDay('')
    setActivity('')
  }

  const handleDelete = (id) => {
    const updatedPlans = plans.filter(
      (plan) => plan.id !== id
    )

    setPlans(updatedPlans)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p className="uppercase tracking-[5px] text-cyan-400 mb-4">
            Plan Your Journey
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Trip Planner
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl leading-8">
            Organize destinations, create
            itineraries, and build unforgettable
            travel experiences with Tripverse.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Create Itinerary
            </h2>

            <form
              onSubmit={handleAddPlan}
              className="space-y-6"
            >
              <input
                type="text"
                placeholder="Trip Name"
                value={tripName}
                onChange={(e) =>
                  setTripName(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) =>
                  setDestination(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="Day (Example: Day 1)"
                value={day}
                onChange={(e) =>
                  setDay(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <textarea
                rows="5"
                placeholder="Activity Details"
                value={activity}
                onChange={(e) =>
                  setActivity(e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              ></textarea>

              <button className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-slate-900 py-4 rounded-2xl font-bold text-lg">
                Add To Itinerary
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                Your Itinerary
              </h2>

              <span className="bg-cyan-400/20 text-cyan-400 px-4 py-2 rounded-full">
                {plans.length} Plans
              </span>
            </div>

            <div className="space-y-6">
              {plans.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
                  <h3 className="text-2xl font-semibold mb-4">
                    No Plans Yet
                  </h3>

                  <p className="text-slate-400">
                    Start creating your travel
                    itinerary.
                  </p>
                </div>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <p className="text-cyan-400 uppercase tracking-wider mb-2">
                          {plan.day}
                        </p>

                        <h3 className="text-3xl font-bold mb-2">
                          {plan.destination}
                        </h3>

                        <p className="text-slate-400">
                          {plan.tripName}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleDelete(plan.id)
                        }
                        className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>

                    <p className="text-slate-300 leading-8">
                      {plan.activity}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripPlanner