import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips, deleteTrip } from "../services/tripService";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trip?")) return;

    await deleteTrip(id);

    fetchTrips();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">My Trips</h1>

        {trips.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-3xl">No Trips Yet</h2>

            <Link
              to="/trip-planner"
              className="inline-block mt-6 bg-cyan-400 text-slate-900 px-6 py-3 rounded-xl font-semibold"
            >
              Plan Your First Trip
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip._id}
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800"
              >
                <h2 className="text-2xl font-bold">{trip.destination}</h2>

                <p className="mt-4 text-slate-400">
                  {new Date(trip.startDate).toLocaleDateString()}
                </p>

                <p className="text-slate-400">
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>

                <p className="mt-4">💰 ${trip.budget}</p>

                <p className="mt-2">{trip.status}</p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleDelete(trip._id)}
                    className="bg-red-500 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTrips;
