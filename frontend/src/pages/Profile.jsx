import { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/userApi";
import { getDashboardData } from "../services/dashboardApi";

function Profile() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    country: "",
  });
  const [stats, setStats] = useState({ trips: 0, countries: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [profile, dashboard] = await Promise.all([
          getProfile(),
          getDashboardData().catch(() => ({ trips: [], budgets: [] })),
        ]);

        const nextUser = profile || user || {};

        setFormData({
          name: nextUser.name || "",
          bio: nextUser.bio || "",
          country: nextUser.country || "",
        });

        const trips = Array.isArray(dashboard.trips) ? dashboard.trips : [];
        const countries = new Set(
          trips
            .map((trip) => trip.destination)
            .filter(Boolean)
            .map((value) => String(value).trim().toLowerCase()),
        );

        setStats({
          trips: trips.length,
          countries: countries.size,
        });

        if (profile) updateUser(profile);
      } catch (err) {
        console.error("Profile load error:", err);
        setError(err.message || "Unable to load your profile.");
        setFormData({
          name: user?.name || "",
          bio: user?.bio || "",
          country: user?.country || "",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const initials = useMemo(() => {
    const name = formData.name || user?.name || "Traveler";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }, [formData.name, user?.name]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const updated = await updateProfile(formData);
      updateUser(updated);
      setFormData({
        name: updated.name || "",
        bio: updated.bio || "",
        country: updated.country || "",
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="site-light-page flex min-h-screen items-center justify-center px-6 pt-28">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 rounded-full border-4 border-cyan-100 border-t-cyan-500"
        />
      </main>
    );
  }

  return (
    <main className="site-light-page px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute left-0 top-32 h-[420px] w-[420px] rounded-full bg-cyan-200/25 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[500px] h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[5px] text-cyan-600">
            Account
          </p>
          <h1 className="text-5xl font-black tracking-tight text-slate-950 md:text-6xl">
            My Profile
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-500">
            Manage your identity, travel preferences and TripVerse account.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-600"
          >
            {message}
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-sky-400 text-3xl font-black text-slate-950 shadow-lg shadow-cyan-200/50">
                {initials}
              </div>
              <h2 className="mt-6 text-2xl font-black text-slate-950">
                {formData.name || "Traveler"}
              </h2>
              <p className="mt-2 break-all text-sm text-slate-500">
                {user?.email}
              </p>
              {formData.country && (
                <p className="mt-3 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
                  {formData.country}
                </p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Trips Planned</p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {stats.trips}
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-50 p-5">
                <p className="text-sm text-cyan-700">Countries</p>
                <p className="mt-2 text-3xl font-black text-slate-950">
                  {stats.countries}
                </p>
              </div>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.07)] md:p-10"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-950">Edit Profile</h2>
              <p className="mt-2 text-slate-500">
                Keep your travel profile up to date.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="trip-input"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="trip-input cursor-not-allowed opacity-60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Country</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className="trip-input"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Tell us about yourself and how you like to travel..."
                  className="trip-input resize-none"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="trip-button rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-2xl border border-red-200 bg-red-50 px-7 py-4 font-bold text-red-600 transition hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

export default Profile;
