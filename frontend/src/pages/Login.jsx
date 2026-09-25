import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Message sent from Register.jsx
  const successMessage = location.state?.message;

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
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`;

      console.log("Login URL:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await res.text();

      console.log("Login status:", res.status);
      console.log("Login response:", text);

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
        throw new Error(data.message || `Login failed (${res.status})`);
      }

      if (!data.token || !data.user) {
        throw new Error(
          "Login succeeded but the server did not return user/token data.",
        );
      }

      // Store authenticated user
      login(data.user, data.token);

      // Go to dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
          {/* Header */}
          <div className="mb-8">
            <p className="text-cyan-500 uppercase tracking-[4px] text-sm font-semibold mb-3">
              Welcome Back
            </p>

            <h1 className="text-4xl font-extrabold text-slate-900">Login</h1>

            <p className="text-slate-500 mt-3">
              Continue your journey with TripVerse.
            </p>
          </div>

          {/* Registration Success */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-6 text-sm">
              {successMessage}
            </div>
          )}

          {/* Login Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 py-4 rounded-xl font-bold transition-all duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-slate-500 mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-500 font-semibold hover:text-cyan-600"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
