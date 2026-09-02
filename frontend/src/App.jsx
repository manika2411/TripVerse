import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Dashboard from './pages/Dashboard'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import PageTransition from './components/PageTransition'

import Home from './pages/Home'
import Explore from './pages/Explore'
import DestinationDetails from './pages/DestinationDetails'
import TripPlanner from './pages/TripPlanner'
import BudgetPlanner from './pages/BudgetPlanner'
import Community from './pages/Community'
import About from './pages/About'
import Contact from './pages/Contact'

import Login from './pages/Login'
import Register from './pages/Register'

import ProtectedRoutes from './components/ProtectedRoutes'

function App() {
  const location = useLocation()

  return (
    <>
      <SmoothScroll />

      <div className="bg-slate-950 text-white min-h-screen relative">

        <Navbar />

        <AnimatePresence
          mode="wait"
        >
          <Routes
            location={location}
            key={location.pathname}
          >

            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />

            <Route
              path="/explore"
              element={
                <PageTransition>
                  <Explore />
                </PageTransition>
              }
            />

            <Route
              path="/destination/:id"
              element={
                <PageTransition>
                  <DestinationDetails />
                </PageTransition>
              }
            />

            <Route
              path="/planner"
              element={
                <PageTransition>
                  <TripPlanner />
                </PageTransition>
              }
            />

            <Route
              path="/trip-planner"
              element={
                <PageTransition>
                  <TripPlanner />
                </PageTransition>
              }
            />

            <Route
              path="/budget"
              element={
                <PageTransition>
                  <BudgetPlanner />
                </PageTransition>
              }
            />

            <Route
              path="/community"
              element={
                <PageTransition>
                  <Community />
                </PageTransition>
              }
            />

            <Route
              path="/about"
              element={
                <PageTransition>
                  <About />
                </PageTransition>
              }
            />

            <Route
              path="/contact"
              element={
                <PageTransition>
                  <Contact />
                </PageTransition>
              }
            />

            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />

            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoutes>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoutes>
              }
            />

          </Routes>
        </AnimatePresence>

        <Footer />

      </div>
    </>
  )
}

export default App