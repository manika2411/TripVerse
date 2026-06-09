import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Explore from './pages/Explore'
import DestinationDetails from './pages/DestinationDetails'
import TripPlanner from './pages/TripPlanner'
import BudgetPlanner from './pages/BudgetPlanner'
import Community from './pages/Community'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {
  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route
          path="/destination/:id"
          element={<DestinationDetails />}
        />
        <Route path="/planner" element={<TripPlanner />} />
        <Route path="/budget" element={<BudgetPlanner />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      </Routes>

      <Footer />
    </div>
  )
}

export default App