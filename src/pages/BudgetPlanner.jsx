import { useEffect, useMemo, useState } from 'react'
import { getCountries } from '../services/countryApi'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

function BudgetPlanner() {
  const [countries, setCountries] = useState([])

  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] =
    useState(null)

  const [filteredOpen, setFilteredOpen] =
    useState(false)

  const [days, setDays] = useState(1)
  const [travelers, setTravelers] = useState(1)

  const [accommodation, setAccommodation] =
    useState('Standard')

  const [transport, setTransport] =
    useState('Flight')

  const [foodBudget, setFoodBudget] = useState(50)

  const [activitiesBudget, setActivitiesBudget] =
    useState(200)

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries()

        setCountries(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCountries()
  }, [])

  // Search filter
  const filteredCountries = countries.filter((country) =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // Region multipliers
  const regionMultiplier = {
    Africa: 0.7,
    Asia: 0.9,
    Europe: 1.5,
    Americas: 1.3,
    Oceania: 1.7,
  }

  const multiplier =
    regionMultiplier[selectedCountry?.region] || 1

  // Pricing
  const accommodationPrices = {
    Budget: 40,
    Standard: 100,
    Luxury: 250,
  }

  const transportPrices = {
    Bus: 50,
    Train: 150,
    Flight: 500,
  }

  // Calculations
  const accommodationTotal =
    accommodationPrices[accommodation] *
    multiplier *
    days *
    travelers

  const transportTotal =
    transportPrices[transport] *
    multiplier *
    travelers

  const foodTotal =
    foodBudget *
    multiplier *
    days *
    travelers

  const activitiesTotal =
    activitiesBudget *
    multiplier *
    travelers

  const totalBudget = Math.floor(
    accommodationTotal +
      transportTotal +
      foodTotal +
      activitiesTotal
  )

  const dailyAverage = useMemo(() => {
    return Math.floor(totalBudget / days)
  }, [totalBudget, days])

  // Currency
  const currency =
    selectedCountry &&
    Object.keys(selectedCountry.currencies || {})[0]

  // Chart data
  const chartData = [
    {
      name: 'Accommodation',
      value: Math.floor(accommodationTotal),
    },
    {
      name: 'Transport',
      value: Math.floor(transportTotal),
    },
    {
      name: 'Food',
      value: Math.floor(foodTotal),
    },
    {
      name: 'Activities',
      value: Math.floor(activitiesTotal),
    },
  ]

  const COLORS = [
    '#22d3ee',
    '#3b82f6',
    '#10b981',
    '#ec4899',
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p className="uppercase tracking-[5px] text-cyan-400 mb-4">
            Smart Budget Planning
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Budget Planner
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl leading-8">
            Estimate travel expenses, compare trip costs,
            and plan smarter journeys with Tripverse.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT SIDE */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Trip Details
            </h2>

            <div className="space-y-6">
              {/* Search Destination */}
              <div className="relative">
                <label className="block mb-3 text-slate-300">
                  Search Destination
                </label>

                <input
                  type="text"
                  placeholder="Search country..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setFilteredOpen(true)
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
                />

                {/* Suggestions */}
                {search && filteredOpen && (
                  <div className="absolute w-full bg-slate-800 border border-slate-700 rounded-2xl mt-2 max-h-64 overflow-y-auto z-50 shadow-2xl">
                    {filteredCountries
                      .slice(0, 8)
                      .map((country, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSelectedCountry(country)
                            setSearch(
                              country.name.common
                            )
                            setFilteredOpen(false)
                          }}
                          className="flex items-center gap-4 p-4 hover:bg-slate-700 cursor-pointer transition"
                        >
                          <img
                            src={country.flags.png}
                            alt={
                              country.name.common
                            }
                            className="w-10 h-6 object-cover rounded"
                          />

                          <div>
                            <p className="font-semibold">
                              {
                                country.name.common
                              }
                            </p>

                            <p className="text-sm text-slate-400">
                              {country.region}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Days */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Number of Days
                </label>

                <input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(e) =>
                    setDays(Number(e.target.value))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Travelers */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Travelers
                </label>

                <input
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) =>
                    setTravelers(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Accommodation */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Accommodation
                </label>

                <select
                  value={accommodation}
                  onChange={(e) =>
                    setAccommodation(
                      e.target.value
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                >
                  <option>Budget</option>
                  <option>Standard</option>
                  <option>Luxury</option>
                </select>
              </div>

              {/* Transportation */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Transportation
                </label>

                <select
                  value={transport}
                  onChange={(e) =>
                    setTransport(e.target.value)
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                >
                  <option>Bus</option>
                  <option>Train</option>
                  <option>Flight</option>
                </select>
              </div>

              {/* Food */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Daily Food Budget
                </label>

                <input
                  type="number"
                  value={foodBudget}
                  onChange={(e) =>
                    setFoodBudget(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>

              {/* Activities */}
              <div>
                <label className="block mb-3 text-slate-300">
                  Activities Budget
                </label>

                <input
                  type="number"
                  value={activitiesBudget}
                  onChange={(e) =>
                    setActivitiesBudget(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* Budget Card */}
            <div className="bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 text-slate-900 rounded-3xl p-10 shadow-2xl">
              <p className="uppercase tracking-[4px] mb-4 font-semibold">
                Estimated Budget
              </p>

              <h2 className="text-6xl font-extrabold mb-4">
                {currency || '---'} {totalBudget}
              </h2>

              <p className="text-lg font-medium">
                Daily Average:{' '}
                {currency || '---'} {dailyAverage}
              </p>
            </div>

            {/* Country Info */}
            {selectedCountry && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-cyan-400 transition">
                <div className="flex items-center gap-5 mb-6">
                  <img
                    src={
                      selectedCountry.flags.png
                    }
                    alt={
                      selectedCountry.name.common
                    }
                    className="w-20 h-14 object-cover rounded-xl shadow-lg"
                  />

                  <div>
                    <h2 className="text-3xl font-bold">
                      {
                        selectedCountry.name
                          .common
                      }
                    </h2>

                    <p className="text-slate-400">
                      {
                        selectedCountry.region
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300">
                  <p>
                    Capital:{' '}
                    <span className="text-white font-semibold">
                      {selectedCountry
                        .capital?.[0] ||
                        'N/A'}
                    </span>
                  </p>

                  <p>
                    Currency:{' '}
                    <span className="text-white font-semibold">
                      {currency}
                    </span>
                  </p>

                  <p>
                    Population:{' '}
                    <span className="text-white font-semibold">
                      {selectedCountry.population.toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Animated Pie Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-8">
                Expense Breakdown
              </h2>

              <div className="h-[400px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={130}
                      innerRadius={70}
                      paddingAngle={5}
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      label
                    >
                      {chartData.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              COLORS[
                                index %
                                  COLORS.length
                              ]
                            }
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BudgetPlanner