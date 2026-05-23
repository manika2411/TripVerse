import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold tracking-wide text-cyan-400"
        >
          TripVerse
        </Link>

        <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider">
          <Link to="/">Home</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/planner">Planner</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar