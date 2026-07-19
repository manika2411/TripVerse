import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TravelContext } from '../context/TravelContext'
import { createTrip } from '../services/tripService'

function TripPlanner() {
  const navigate = useNavigate()

  const {
    selectedDestination,
    suggestedActivities,
    clearActivities,
  } = useContext(TravelContext)

  const [tripName, setTripName] = useState('')
  const [destination, setDestination] = useState(
    selectedDestination?.name?.common || ''
  )

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [budget, setBudget] = useState('')
  const [notes, setNotes] = useState('')

  const [activityInput, setActivityInput] = useState('')
  const [activities, setActivities] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedDestination) {
      setDestination(selectedDestination.name.common)
    }
  }, [selectedDestination])

  useEffect(() => {
    if (suggestedActivities.length > 0) {
      setActivities((prev) => {
        const merged = [...prev]

        suggestedActivities.forEach((activity) => {
          if (!merged.includes(activity)) {
            merged.push(activity)
          }
        })

        return merged
      })

      clearActivities()
    }
  }, [
    suggestedActivities,
    clearActivities,
  ])

  const addActivity = () => {
    if (!activityInput.trim()) return

    setActivities((prev) => [
      ...prev,
      activityInput,
    ])

    setActivityInput('')
  }

  const removeActivity = (index) => {
    setActivities((prev) =>
      prev.filter((_, i) => i !== index)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !tripName ||
      !destination ||
      !startDate ||
      !endDate ||
      !budget
    ) {
      alert('Please fill all required fields.')
      return
    }

    try {
      setLoading(true)

      await createTrip({
        tripName,
        destination,
        startDate,
        endDate,
        budget: Number(budget),
        activities,
        notes,
      })

      alert('Trip created successfully!')

      navigate('/my-trips')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-12">

          <p className="uppercase tracking-[5px] text-cyan-400 mb-3">
            Plan Your Journey
          </p>

          <h1 className="text-6xl font-bold mb-5">
            Trip Planner
          </h1>

          <p className="text-slate-400 max-w-3xl">
            Create your trip, organize activities,
            manage your budget and save everything
            securely to your account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-2 gap-10"
        >

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">

            <h2 className="text-3xl font-bold">
              Trip Details
            </h2>

            <input
              type="text"
              placeholder="Trip Name"
              value={tripName}
              onChange={(e) =>
                setTripName(e.target.value)
              }
              className="w-full bg-slate-800 rounded-xl p-4"
            />

            <input
              type="text"
              placeholder="Destination"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
              className="w-full bg-slate-800 rounded-xl p-4"
            />

            <div className="grid grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 text-slate-400">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                  className="w-full bg-slate-800 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-2 text-slate-400">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                  className="w-full bg-slate-800 rounded-xl p-4"
                />

              </div>

            </div>

            <input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              className="w-full bg-slate-800 rounded-xl p-4"
            />

            <textarea
              rows="5"
              placeholder="Trip Notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="w-full bg-slate-800 rounded-xl p-4"
            />
                        <div>

              <h2 className="text-3xl font-bold mb-6">
                Activities
              </h2>

              <div className="flex gap-3">

                <input
                  type="text"
                  placeholder="Add an activity"
                  value={activityInput}
                  onChange={(e) =>
                    setActivityInput(e.target.value)
                  }
                  className="flex-1 bg-slate-800 rounded-xl p-4"
                />

                <button
                  type="button"
                  onClick={addActivity}
                  className="bg-cyan-400 text-slate-900 px-6 rounded-xl font-semibold hover:bg-cyan-300 transition"
                >
                  Add
                </button>

              </div>

              {activities.length > 0 && (
                <div className="mt-6 space-y-3">

                  {activities.map((activity, index) => (

                    <div
                      key={index}
                      className="flex items-center justify-between bg-slate-800 p-4 rounded-xl"
                    >

                      <span>{activity}</span>

                      <button
                        type="button"
                        onClick={() =>
                          removeActivity(index)
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </div>

          {/* Preview */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Trip Preview
            </h2>

            <div className="space-y-6">

              <div>
                <p className="text-slate-400">
                  Trip Name
                </p>

                <h3 className="text-2xl font-bold">
                  {tripName || 'Not specified'}
                </h3>
              </div>

              <div>
                <p className="text-slate-400">
                  Destination
                </p>

                <h3 className="text-2xl font-bold">
                  {destination || 'Not selected'}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <p className="text-slate-400">
                    Start
                  </p>

                  <p>
                    {startDate || '--'}
                  </p>

                </div>

                <div>

                  <p className="text-slate-400">
                    End
                  </p>

                  <p>
                    {endDate || '--'}
                  </p>

                </div>

              </div>

              <div>

                <p className="text-slate-400">
                  Budget
                </p>

                <h3 className="text-3xl font-bold text-cyan-400">
                  {budget
                    ? `$${budget}`
                    : '$0'}
                </h3>

              </div>

              <div>

                <p className="text-slate-400 mb-3">
                  Activities
                </p>

                {activities.length === 0 ? (

                  <p className="text-slate-500">
                    No activities added.
                  </p>

                ) : (

                  <ul className="space-y-2">

                    {activities.map(
                      (activity, index) => (
                        <li
                          key={index}
                          className="bg-slate-800 rounded-xl px-4 py-3"
                        >
                          • {activity}
                        </li>
                      )
                    )}

                  </ul>

                )}

              </div>

              <div>

                <p className="text-slate-400 mb-2">
                  Notes
                </p>

                <p className="leading-7 text-slate-300">
                  {notes ||
                    'No notes added.'}
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-cyan-400 hover:bg-cyan-300 transition text-slate-900 py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                {loading
                  ? 'Saving Trip...'
                  : 'Save Trip'}
              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  )
}

export default TripPlanner