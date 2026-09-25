import { Link } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#051523]">
      <div className="absolute inset-0 trip-grid opacity-20" />

      <div className="relative z-10 max-w-[1500px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}

          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black trip-gradient-text">
              TripVerse
            </h2>

            <p className="text-slate-400 max-w-md mt-5 leading-7">
              Discover destinations, design unforgettable itineraries and
              experience travel beyond the ordinary.
            </p>

            <div className="flex gap-3 mt-7">
              {[FaInstagram, FaGithub, FaLinkedinIn].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="
                      w-11
                      h-11
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      flex
                      items-center
                      justify-center
                      text-slate-300
                      hover:text-cyan-300
                      hover:border-cyan-300/40
                      transition
                    "
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* EXPLORE */}

          <div>
            <h3 className="font-bold text-white mb-5">Explore</h3>

            <div className="space-y-3 text-slate-400">
              <Link
                className="block hover:text-cyan-300 transition"
                to="/explore"
              >
                Destinations
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/planner"
              >
                Trip Planner
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/budget"
              >
                Budget Planner
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/community"
              >
                Community
              </Link>
            </div>
          </div>

          {/* COMPANY */}

          <div>
            <h3 className="font-bold text-white mb-5">Company</h3>

            <div className="space-y-3 text-slate-400">
              <Link
                className="block hover:text-cyan-300 transition"
                to="/about"
              >
                About
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/contact"
              >
                Contact
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="block hover:text-cyan-300 transition"
                to="/register"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <div className="trip-divider my-10" />

        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TripVerse. All rights reserved.</p>

          <p>Travel Beyond Expectations.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
