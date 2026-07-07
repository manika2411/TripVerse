import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      login(data.user, data.token)

      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-md border border-slate-800">

        <h1 className="text-4xl font-bold text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 mb-8">
          Join Tripverse
        </p>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-white"
            required
          />

          <button
            className="w-full bg-cyan-400 text-slate-900 py-4 rounded-xl font-bold hover:bg-cyan-300 transition"
            disabled={loading}
          >
            {loading
              ? 'Creating Account...'
              : 'Register'}
          </button>

        </form>

        <p className="text-center text-slate-400 mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-cyan-400"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Register