import { useLocation, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoutes from "./components/ProtectedRoutes";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import DestinationDetails from "./pages/DestinationDetails";
import TripPlanner from "./pages/TripPlanner";
import BudgetPlanner from "./pages/BudgetPlanner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Recommendations from "./pages/Recommendations";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Community from "./pages/Community";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen">
      <Navbar />
      <ScrollToTop />

      <div className={isHome ? "site-content home-content" : "site-content inner-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/planner" element={<ProtectedRoutes><TripPlanner /></ProtectedRoutes>} />
          <Route path="/budget-planner" element={<ProtectedRoutes><BudgetPlanner /></ProtectedRoutes>} />
          <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
          <Route path="/community" element={<ProtectedRoutes><Community /></ProtectedRoutes>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommendations" element={<ProtectedRoutes><Recommendations /></ProtectedRoutes>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
