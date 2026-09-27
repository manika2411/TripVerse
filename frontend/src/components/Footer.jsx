import { Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-white">
      <div className="absolute inset-0 trip-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black text-slate-950">
              Trip<span className="text-cyan-500">Verse</span>
            </h2>
            <p className="mt-5 max-w-md leading-7 text-slate-500">
              Discover destinations, design unforgettable itineraries and experience travel beyond the ordinary.
            </p>
            <div className="mt-7 flex gap-3">
              {[FaInstagram, FaGithub, FaLinkedinIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-slate-900">Explore</h3>
            <div className="space-y-3 text-slate-500">
              <Link className="block transition hover:text-cyan-600" to="/explore">Destinations</Link>
              <Link className="block transition hover:text-cyan-600" to="/planner">Trip Planner</Link>
              <Link className="block transition hover:text-cyan-600" to="/budget-planner">Budget Planner</Link>
              <Link className="block transition hover:text-cyan-600" to="/community">Community</Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-bold text-slate-900">Company</h3>
            <div className="space-y-3 text-slate-500">
              <Link className="block transition hover:text-cyan-600" to="/about">About</Link>
              <Link className="block transition hover:text-cyan-600" to="/contact">Contact</Link>
              <Link className="block transition hover:text-cyan-600" to="/login">Login</Link>
              <Link className="block transition hover:text-cyan-600" to="/register">Sign Up</Link>
            </div>
          </div>
        </div>

        <div className="trip-divider my-10" />

        <div className="flex flex-col justify-between gap-4 text-sm text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} TripVerse. All rights reserved.</p>
          <p>Travel Beyond Expectations.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
