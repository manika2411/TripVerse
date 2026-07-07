import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    country: user?.country || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend update will be added later
    setMessage("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="mb-12">
          <p className="uppercase tracking-[5px] text-cyan-400 mb-3">Account</p>

          <h1 className="text-5xl font-bold">My Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* LEFT */}

          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-cyan-400 flex items-center justify-center text-5xl font-bold text-slate-900">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>

              <h2 className="text-3xl font-bold mt-6">{user?.name}</h2>

              <p className="text-slate-400 mt-2">{user?.email}</p>
            </div>

            <div className="mt-10 space-y-5">
              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-cyan-400">Trips Planned</h3>

                <p className="text-3xl font-bold mt-2">0</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-5">
                <h3 className="text-cyan-400">Countries Explored</h3>

                <p className="text-3xl font-bold mt-2">0</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-8">
            <h2 className="text-3xl font-bold mb-8">Edit Profile</h2>

            {message && (
              <div className="bg-green-500/20 text-green-400 p-4 rounded-xl mb-6">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-slate-400">Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-400">Email</label>

                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 opacity-70 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-400">Country</label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
                />
              </div>

              <div>
                <label className="block mb-2 text-slate-400">Bio</label>

                <textarea
                  rows="5"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4"
                />
              </div>

              <div className="flex gap-5 flex-wrap">
                <button
                  type="submit"
                  className="bg-cyan-400 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-300 transition"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="bg-red-500 px-8 py-4 rounded-xl hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
