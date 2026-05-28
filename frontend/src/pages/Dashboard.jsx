import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    const savedPlans =
      localStorage.getItem('tripPlans')

    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    }
  }, [])

  const destinations =
    new Set(
      plans.map(
        (plan) => plan.destination
      )
    )

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-14">

          <p className="uppercase tracking-[5px] text-cyan-400 mb-4">
            Your Travel Hub
          </p>

          <h1 className="text-5xl md:text-7xl font-bold">
            Dashboard
          </h1>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-4 gap-6 mb-14">

          <div className="bg-slate-900 rounded-3xl p-8">
            <h2 className="text-4xl font-bold">
              {plans.length}
            </h2>

            <p className="text-slate-400 mt-2">
              Plans
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8">
            <h2 className="text-4xl font-bold">
              {destinations.size}
            </h2>

            <p className="text-slate-400 mt-2">
              Destinations
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8">
            <h2 className="text-4xl font-bold">
              {
                plans.filter(
                  (p) =>
                    p.tripName ===
                    'Suggested Activity'
                ).length
              }
            </h2>

            <p className="text-slate-400 mt-2">
              Suggested Activities
            </p>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8">
            <h2 className="text-4xl font-bold">
              {plans.length * 2}
            </h2>

            <p className="text-slate-400 mt-2">
              Estimated Travel Days
            </p>
          </div>

        </div>

        {/* Recent Plans */}

        <div className="bg-slate-900 rounded-3xl p-8 mb-12">

          <h2 className="text-3xl font-bold mb-8">
            Recent Itineraries
          </h2>

          {plans.length === 0 ? (

            <p className="text-slate-400">
              No trips created yet.
            </p>

          ) : (

            <div className="space-y-5">

              {plans
                .slice(-5)
                .reverse()
                .map((plan) => (

                  <div
                    key={plan.id}
                    className="border-b border-slate-800 pb-5"
                  >

                    <p className="text-cyan-400">
                      {plan.day}
                    </p>

                    <h3 className="text-2xl font-semibold">
                      {plan.destination}
                    </h3>

                    <p className="text-slate-400">
                      {plan.activity}
                    </p>

                  </div>

                ))}

            </div>

          )}

        </div>

        {/* Quick Actions */}

        <div className="flex gap-6 flex-wrap">

          <Link
            to="/planner"
            className="bg-cyan-400 text-slate-900 px-8 py-4 rounded-2xl font-semibold"
          >
            Continue Planning
          </Link>

          <Link
            to="/explore"
            className="border border-slate-700 px-8 py-4 rounded-2xl"
          >
            Explore Countries
          </Link>

          <Link
            to="/budget"
            className="border border-slate-700 px-8 py-4 rounded-2xl"
          >
            Open Budget Planner
          </Link>

        </div>

      </div>
    </div>
  )
}

export default Dashboard