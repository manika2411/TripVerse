import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getTrips } from "../services/tripService";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await getTrips();
        setTrips(data);
      } catch (error) {
        console.error("Failed to load trips:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, []);

  const upcomingTrips = trips.filter((trip) => trip.status === "Upcoming");

  const completedTrips = trips.filter((trip) => trip.status === "Completed");

  const totalBudget = trips.reduce(
    (total, trip) => total + Number(trip.budget || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-xl text-slate-400">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="mb-12">
          <p className="text-cyan-400 uppercase tracking-[5px] mb-3">
            Your Journey
          </p>

          <h1 className="text-5xl md:text-6xl font-bold">
            Welcome, {user?.name || "Traveler"} 👋
          </h1>

          <p className="text-slate-400 text-lg mt-4">
            Here's everything about your travel plans.
          </p>
        </div>

        {/* STATS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">Total Trips</p>

            <h2 className="text-4xl font-bold mt-3 text-cyan-400">
              {trips.length}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">Upcoming</p>

            <h2 className="text-4xl font-bold mt-3">{upcomingTrips.length}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">Completed</p>

            <h2 className="text-4xl font-bold mt-3">{completedTrips.length}</h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">
            <p className="text-slate-400">Planned Budget</p>

            <h2 className="text-4xl font-bold mt-3 text-cyan-400">
              ${totalBudget.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/trip-planner"
            className="bg-cyan-400 text-slate-950 rounded-3xl p-7 hover:bg-cyan-300 transition"
          >
            <p className="text-3xl mb-4">✈️</p>

            <h2 className="text-2xl font-bold">Plan a Trip</h2>

            <p className="mt-2 opacity-70">Create a new travel itinerary.</p>
          </Link>

          <Link
            to="/my-trips"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-cyan-400 transition"
          >
            <p className="text-3xl mb-4">🗺️</p>

            <h2 className="text-2xl font-bold">My Trips</h2>

            <p className="text-slate-400 mt-2">
              View and manage your saved trips.
            </p>
          </Link>

          <Link
            to="/explore"
            className="bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-cyan-400 transition"
          >
            <p className="text-3xl mb-4">🌎</p>

            <h2 className="text-2xl font-bold">Explore</h2>

            <p className="text-slate-400 mt-2">
              Discover your next destination.
            </p>
          </Link>
        </div>

        {/* RECENT TRIPS */}

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Recent Trips</h2>

              <p className="text-slate-400 mt-2">Your latest travel plans</p>
            </div>

            {trips.length > 0 && (
              <Link
                to="/my-trips"
                className="text-cyan-400 hover:text-cyan-300"
              >
                View All →
              </Link>
            )}
          </div>

          {trips.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-5">✈️</div>

              <h3 className="text-2xl font-bold">Your journey starts here</h3>

              <p className="text-slate-400 mt-3">
                You haven't created any trips yet.
              </p>

              <Link
                to="/trip-planner"
                className="inline-block mt-7 bg-cyan-400 text-slate-950 px-7 py-3 rounded-xl font-semibold hover:bg-cyan-300 transition"
              >
                Create Your First Trip
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.slice(0, 3).map((trip) => (
                <div
                  key={trip._id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-7 hover:border-cyan-400 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-cyan-400 text-sm uppercase tracking-wider">
                        {trip.status}
                      </p>

                      <h3 className="text-2xl font-bold mt-2">
                        {trip.tripName}
                      </h3>
                    </div>

                    <span className="text-2xl">🌍</span>
                  </div>

                  <p className="text-slate-400 mt-4">📍 {trip.destination}</p>

                  <p className="text-slate-400 mt-2">
                    📅 {new Date(trip.startDate).toLocaleDateString()}
                    {" → "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>

                  <div className="mt-5 pt-5 border-t border-slate-800">
                    <span className="text-slate-400">Budget</span>

                    <p className="text-xl font-bold text-cyan-400 mt-1">
                      ${Number(trip.budget || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
