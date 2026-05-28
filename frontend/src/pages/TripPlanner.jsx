import { useContext, useEffect, useState,} from 'react'
import { TravelContext } from '../context/TravelContext'

function TripPlanner() {
  const {
    selectedDestination,
    suggestedActivities,
    clearActivities,
  } = useContext(TravelContext)

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

  // Autofill destination from selected country
  useEffect(() => {
    if (selectedDestination) {
      setDestination(
        selectedDestination.name.common
      )
    }
  }, [selectedDestination])

  // Auto-add suggested activities
  useEffect(() => {
    if (
      suggestedActivities.length > 0
    ) {
      const generatedPlans =
        suggestedActivities.map(
          (activity, index) => ({
            id:
              Date.now() + index,

            tripName:
              'Suggested Activity',

            destination:
              selectedDestination?.name
                ?.common ||
              destination,

            day: `Day ${index + 1}`,

            activity,
          })
        )

      setPlans((prev) => {
        const existingActivities =
          prev.map(
            (plan) => plan.activity
          )

        const uniquePlans =
          generatedPlans.filter(
            (plan) =>
              !existingActivities.includes(
                plan.activity
              )
          )

        return [
          ...prev,
          ...uniquePlans,
        ]
      })

      clearActivities()
    }
  }, [
    suggestedActivities,
    selectedDestination,
    destination,
    clearActivities,
  ])

  const handleAddPlan = (e) => {
    e.preventDefault()

    if (
      !destination ||
      !day ||
      !activity
    )
      return

    const newPlan = {
      id: Date.now(),

      tripName,

      destination,

      day,

      activity,
    }

    setPlans((prev) => [
      ...prev,
      newPlan,
    ])

    setDay('')
    setActivity('')
  }

  const handleDelete = (id) => {
    setPlans((prev) =>
      prev.filter(
        (plan) => plan.id !== id
      )
    )
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
            Organize destinations,
            create itineraries,
            and build unforgettable
            travel experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* FORM */}

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
                  setTripName(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) =>
                  setDestination(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                placeholder="Day (Day 1)"
                value={day}
                onChange={(e) =>
                  setDay(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <textarea
                rows="5"
                placeholder="Activity Details"
                value={activity}
                onChange={(e) =>
                  setActivity(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
              />

              <button className="w-full bg-cyan-400 hover:bg-cyan-300 transition text-slate-900 py-4 rounded-2xl font-bold">
                Add To Itinerary
              </button>

            </form>
          </div>

          {/* TIMELINE */}

          <div>

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold">
                  Your Itinerary
                </h2>

                {selectedDestination && (
                  <p className="text-slate-400 mt-2">
                    Planning for{' '}
                    {
                      selectedDestination.name.common
                    }
                  </p>
                )}

              </div>

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
                    Start building your trip.
                  </p>

                </div>

              ) : (

                plans.map((plan) => (

                  <div
                    key={plan.id}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                  >

                    <div className="flex justify-between mb-5">

                      <div>

                        <p className="text-cyan-400 uppercase mb-2">
                          {plan.day}
                        </p>

                        <h3 className="text-2xl font-bold">
                          {plan.destination}
                        </h3>

                        <p className="text-slate-400">
                          {plan.tripName}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDelete(
                            plan.id
                          )
                        }
                        className="bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl transition"
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