import {
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { TravelContext } from '../context/TravelContext'

function DestinationDetails() {
  const { id } = useParams()

  const navigate = useNavigate()

  const { setSelectedDestination } =
    useContext(TravelContext)

  const [country, setCountry] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${id}`
        )

        const data = await response.json()

        setCountry(data[0])
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [id])

  if (loading) {
    return (
      <div className="pt-32 text-center text-3xl text-white bg-slate-950 min-h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="relative h-[60vh]">
        <img
          src={country.flags.png}
          alt={country.name.common}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute bottom-10 left-10">
          <h1 className="text-6xl font-bold mb-4">
            {country.name.common}
          </h1>

          <p className="text-xl text-slate-300">
            {country.region}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">
              Country Information
            </h2>

            <div className="space-y-5 text-lg">
              <p>
                <span className="font-semibold text-cyan-400">
                  Capital:
                </span>{' '}
                {country.capital?.[0]}
              </p>

              <p>
                <span className="font-semibold text-cyan-400">
                  Population:
                </span>{' '}
                {country.population.toLocaleString()}
              </p>

              <p>
                <span className="font-semibold text-cyan-400">
                  Region:
                </span>{' '}
                {country.region}
              </p>

              <p>
                <span className="font-semibold text-cyan-400">
                  Timezones:
                </span>{' '}
                {country.timezones?.join(', ')}
              </p>
            </div>
          </div>

          {/* Overview */}
          <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 hover:border-cyan-400 transition">
            <h2 className="text-3xl font-bold mb-6">
              Travel Overview
            </h2>

            <p className="text-slate-400 leading-8">
              Explore the beauty, culture,
              landscapes, and experiences of{' '}
              {country.name.common}. Discover
              attractions, local cuisine,
              adventures, and unforgettable
              journeys with Tripverse.
            </p>

            <button
              onClick={() => {
                setSelectedDestination(country)
                navigate('/planner')
              }}
              className="mt-8 bg-cyan-400 hover:bg-cyan-300 transition text-slate-900 px-8 py-4 rounded-full font-semibold"
            >
              Start Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetails