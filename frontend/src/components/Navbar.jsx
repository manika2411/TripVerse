import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "EXPLORE", path: "/explore" },
    { label: "PLANNER", path: "/planner" },
    { label: "BUDGET", path: "/budget-planner" },
    { label: "DASHBOARD", path: "/dashboard" },
    { label: "COMMUNITY", path: "/community" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          fixed
          top-0
          left-0
          right-0
          z-50
          transition-all
          duration-500
          ${
            scrolled
              ? "bg-[#071827]/80 backdrop-blur-2xl border-b border-cyan-300/10 shadow-[0_10px_50px_rgba(3,15,28,0.25)]"
              : "bg-gradient-to-b from-[#061524]/50 to-transparent"
          }
        `}
      >
        {/* TOP CYAN LINE */}

        <motion.div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
        />

        <div className="max-w-[1900px] mx-auto px-6 md:px-10">
          <div className="h-[88px] flex items-center justify-between">
            {/* LOGO */}

            <Link to="/" className="relative group flex items-center">
              <motion.span
                whileHover={{ scale: 1.04 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="text-3xl md:text-4xl font-black tracking-tight trip-gradient-text"
              >
                TripVerse
              </motion.span>

              <span
                className="
                  absolute
                  -inset-4
                  bg-cyan-300/10
                  blur-2xl
                  rounded-full
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                  -z-10
                "
              />
            </Link>

            {/* DESKTOP NAV */}

            <div className="hidden xl:flex items-center gap-7">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="relative group py-2"
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`
                          text-[13px]
                          font-semibold
                          tracking-[0.12em]
                          transition-colors
                          duration-300
                          ${
                            isActive
                              ? "text-cyan-300"
                              : "text-slate-200/85 group-hover:text-white"
                          }
                        `}
                      >
                        {item.label}
                      </span>

                      {isActive && (
                        <motion.span
                          layoutId="navbar-active"
                          className="
                            absolute
                            left-0
                            right-0
                            -bottom-1
                            h-[2px]
                            bg-cyan-300
                            shadow-[0_0_14px_rgba(34,211,238,0.8)]
                          "
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                          }}
                        />
                      )}

                      {!isActive && (
                        <span
                          className="
                            absolute
                            left-1/2
                            -bottom-1
                            h-[2px]
                            w-0
                            -translate-x-1/2
                            bg-cyan-300/60
                            transition-all
                            duration-300
                            group-hover:w-full
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* AUTH */}

            <div className="hidden lg:flex items-center gap-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      tracking-wide
                      text-slate-100
                      hover:text-cyan-300
                      transition
                    "
                  >
                    LOGIN
                  </Link>

                  <Link
                    to="/register"
                    className="
                      px-7
                      py-3.5
                      rounded-full
                      bg-cyan-400
                      text-slate-950
                      font-bold
                      text-sm
                      shadow-[0_10px_35px_rgba(34,211,238,0.18)]
                      hover:bg-cyan-300
                      hover:-translate-y-0.5
                      transition-all
                    "
                  >
                    SIGN UP
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-slate-100
                      hover:text-cyan-300
                      transition
                    "
                  >
                    PROFILE
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="
                      px-6
                      py-3
                      rounded-full
                      border
                      border-white/15
                      bg-white/5
                      backdrop-blur-md
                      text-sm
                      font-semibold
                      text-white
                      hover:border-cyan-300/50
                      hover:text-cyan-300
                      transition-all
                    "
                  >
                    LOGOUT
                  </button>
                </>
              )}
            </div>

            {/* MOBILE BUTTON */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                xl:hidden
                w-11
                h-11
                rounded-full
                border
                border-white/15
                bg-white/5
                backdrop-blur-md
                flex
                flex-col
                items-center
                justify-center
                gap-1.5
              "
            >
              <span className="w-5 h-[2px] bg-white" />
              <span className="w-5 h-[2px] bg-cyan-300" />
              <span className="w-5 h-[2px] bg-white" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="
              fixed
              top-[88px]
              left-4
              right-4
              z-40
              xl:hidden
              rounded-3xl
              border
              border-white/10
              bg-[#0a2237]/95
              backdrop-blur-2xl
              shadow-2xl
              p-5
            "
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    px-5
                    py-3
                    rounded-2xl
                    text-sm
                    font-semibold
                    tracking-wider
                    transition
                    ${
                      isActive
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-200 hover:bg-white/5"
                    }
                  `}
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="border-t border-white/10 mt-3 pt-3">
                {!user ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      className="text-center py-3 rounded-xl border border-white/10 text-white"
                    >
                      LOGIN
                    </Link>

                    <Link
                      to="/register"
                      className="text-center py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold"
                    >
                      SIGN UP
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/profile"
                      className="text-center py-3 rounded-xl border border-white/10 text-white"
                    >
                      PROFILE
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="py-3 rounded-xl bg-white/5 text-white"
                    >
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
