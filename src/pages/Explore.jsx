import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCountries } from '../services/countryApi'
import { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'

function Explore() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getCountries()

        setCountries(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesRegion =
      region === 'All' || country.region === region

    return matchesSearch && matchesRegion
  })

  return (
    <div className="pt-32 px-6 min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <p className="uppercase tracking-[5px] text-cyan-400 mb-4">
            Explore The World
          </p>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover Beautiful Destinations
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl leading-8">
            Browse countries, discover cultures, and start planning
            unforgettable journeys across the globe with Tripverse.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 w-full md:w-96 outline-none focus:border-cyan-400 transition"
          />

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400 transition"
          >
            <option value="All">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <h2 className="text-3xl font-semibold">
              Loading destinations...
            </h2>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-10">
              <p className="text-slate-400">
                Showing {filteredCountries.length} destinations
              </p>
            </div>

            {/* Country Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCountries.map((country, index) => (
                <Link
                  to={`/destination/${country.name.common}`}
                  key={index}
                  className="group bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-cyan-400 transition duration-300"
                >
                  {/* Flag */}
                  <div className="overflow-hidden">
                    <img
                      src={country.flags.png}
                      alt={country.name.common}
                      className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold">
                        {country.name.common}
                      </h2>

                      <span className="bg-cyan-400/20 text-cyan-400 text-sm px-3 py-1 rounded-full">
                        {country.region}
                      </span>
                    </div>

                    <div className="space-y-3 text-slate-400">
                      <p>
                        <span className="text-white font-medium">
                          Capital:
                        </span>{' '}
                        {country.capital?.[0] || 'N/A'}
                      </p>

                      <p>
                        <span className="text-white font-medium">
                          Population:
                        </span>{' '}
                        {country.population.toLocaleString()}
                      </p>
                    </div>

                    <button className="mt-6 w-full bg-cyan-400 text-slate-900 py-3 rounded-2xl font-semibold hover:bg-cyan-300 transition">
                      Explore Destination
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Explore