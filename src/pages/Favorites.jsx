import { useContext } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'
import { Link } from 'react-router-dom'

function Favorites() {
  const { favorites, removeFavorite } =
    useContext(FavoritesContext)

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <p className="uppercase tracking-[5px] text-cyan-400 mb-4">
            Saved Destinations
          </p>

          <h1 className="text-5xl md:text-7xl font-bold">
            Your Favorites
          </h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              No Favorites Yet
            </h2>

            <p className="text-slate-400">
              Start saving destinations you love.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((country, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden"
              >
                <Link
                  to={`/destination/${country.name.common}`}
                >
                  <img
                    src={country.flags.png}
                    alt={country.name.common}
                    className="w-full h-56 object-cover"
                  />
                </Link>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-3">
                    {country.name.common}
                  </h2>

                  <p className="text-slate-400 mb-6">
                    {country.region}
                  </p>

                  <button
                    onClick={() =>
                      removeFavorite(country.name.common)
                    }
                    className="w-full bg-red-500 hover:bg-red-600 transition py-3 rounded-2xl"
                  >
                    Remove Favorite
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites