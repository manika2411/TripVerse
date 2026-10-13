import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition } from "../utils/animations";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/register`;

      console.log("Register URL:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();

      console.log("Register status:", res.status);
      console.log("Register response:", text);

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned an invalid response (${res.status})`,
          );
        }
      }

      if (!res.ok) {
        throw new Error(data.message || `Registration failed (${res.status})`);
      }

      // Registration successful.
      // Do NOT automatically log the user in.
      navigate("/login", {
        state: {
          message: "Account created successfully! Please login.",
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      setError(err.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="site-light-page flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-md">
        <motion.div {...pageTransition} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[5px] text-cyan-600">
              Join TripVerse
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">
              Create Account
            </h1>

            <p className="text-slate-500 mt-3">
              Start planning your next adventure.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                required
                minLength={6}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 py-4 rounded-xl font-bold transition-all duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-500 font-semibold hover:text-cyan-600"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}

export default Register;
