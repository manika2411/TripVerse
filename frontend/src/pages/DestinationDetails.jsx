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
import CountryMap from '../components/CountryMap'

function DestinationDetails() {
  const { id } = useParams()

  const navigate = useNavigate()

  const {
    setSelectedDestination,
    addSuggestedActivity,
  } = useContext(TravelContext)

  const [country, setCountry] = useState(null)

  const [loading, setLoading] = useState(true)

  const activitiesByRegion = {
    Asia: [
      'Street Food Tour',
      'Temple Visit',
      'City Exploration',
    ],

    Europe: [
      'Historic Walk',
      'Museum Tour',
      'Local Cuisine Tour',
    ],

    Americas: [
      'Beach Experience',
      'Nature Adventure',
      'City Tour',
    ],

    Africa: [
      'Safari Adventure',
      'Wildlife Exploration',
      'Local Market Visit',
    ],

    Oceania: [
      'Island Hopping',
      'Coastal Exploration',
      'Adventure Sports',
    ],
  }

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
      <div className="pt-32 min-h-screen bg-slate-950 text-white text-center">
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
          <h1 className="text-6xl font-bold">
            {country.name.common}
          </h1>

          <p className="text-xl text-slate-300">
            {country.region}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Country Info */}

          <div>
            <h2 className="text-3xl font-bold mb-8">
              Country Information
            </h2>

            <div className="space-y-5 text-lg">
              <p>
                Capital: {country.capital?.[0]}
              </p>

              <p>
                Population:{' '}
                {country.population.toLocaleString()}
              </p>

              <p>
                Region: {country.region}
              </p>

              <p>
                Timezones:{' '}
                {country.timezones?.join(', ')}
              </p>
            </div>
          </div>

          {/* Overview */}

          <div className="bg-slate-900 rounded-3xl p-10 border border-slate-800">
            <h2 className="text-3xl font-bold mb-6">
              Travel Overview
            </h2>

            <p className="text-slate-400 leading-8 mb-8">
              Explore culture, food,
              landscapes and adventures in{' '}
              {country.name.common}.
            </p>

            <button
              onClick={() => {
                setSelectedDestination(country)

                navigate('/planner')
              }}
              className="bg-cyan-400 text-slate-900 px-8 py-4 rounded-full font-semibold hover:bg-cyan-300 transition"
            >
              Start Planning
            </button>
          </div>
        </div>

        {/* Suggested Activities */}

        <div className="mt-16 bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Suggested Activities
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {(activitiesByRegion[
              country.region
            ] || []).map(
              (activity, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-2xl p-5 flex justify-between items-center"
                >
                  <p>{activity}</p>

                  <button
                    onClick={() =>
                      addSuggestedActivity(
                        activity
                      )
                    }
                    className="bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-4xl font-bold mb-8">
            Explore On Map
          </h2>

          <CountryMap
            lat={country.latlng?.[0]}
            lng={country.latlng?.[1]}
            name={country.name.common}
          />
        </div>
      </div>
    </div>
  )
}

export default DestinationDetails