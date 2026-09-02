import { useContext, useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)

  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      label: 'HOME',
      path: '/',
    },
    {
      label: 'EXPLORE',
      path: '/explore',
    },
    {
      label: 'PLANNER',
      path: '/planner',
    },
    {
      label: 'BUDGET',
      path: '/budget',
    },
    {
      label: 'DASHBOARD',
      path: '/dashboard',
    },
    {
      label: 'COMMUNITY',
      path: '/community',
    },
    {
      label: 'ABOUT',
      path: '/about',
    },
    {
      label: 'CONTACT',
      path: '/contact',
    },
  ]

  return (
    <>
      <motion.nav
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          delay: 0.1,
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
              ? 'bg-slate-950/75 backdrop-blur-2xl border-b border-cyan-400/10 shadow-2xl shadow-cyan-950/10'
              : 'bg-transparent'
          }
        `}
      >

        {/* TOP LIGHT LINE */}

        <motion.div
          className="absolute top-0 left-0 h-px bg-cyan-400"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
        />

        <div className="max-w-[1900px] mx-auto px-6 md:px-10">

          <div className="h-[88px] flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              className="relative group flex items-center"
            >
              <motion.div
                whileHover={{
                  scale: 1.04,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 20,
                }}
              >
                <span className="text-3xl md:text-4xl font-black tracking-tight trip-gradient-text">
                  TripVerse
                </span>
              </motion.div>

              {/* Logo glow */}

              <span
                className="
                  absolute
                  -inset-3
                  bg-cyan-400/10
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
                              ? 'text-cyan-400'
                              : 'text-slate-300 group-hover:text-white'
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
                            bg-cyan-400
                            shadow-[0_0_12px_rgba(34,211,238,0.8)]
                          "
                          transition={{
                            type: 'spring',
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
                            bg-cyan-400/60
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
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      tracking-wide
                      text-slate-200
                      hover:text-cyan-400
                      transition
                    "
                  >
                    LOGIN
                  </Link>

                  <Link
                    to="/register"
                    className="
                      trip-button
                      relative
                      bg-cyan-400
                      text-slate-950
                      px-5
                      py-2.5
                      rounded-xl
                      text-sm
                      font-bold
                      shadow-lg
                      shadow-cyan-500/10
                      hover:bg-cyan-300
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
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-semibold
                      text-slate-200
                      hover:bg-white/5
                      hover:text-cyan-400
                      transition
                    "
                  >
                    <span
                      className="
                        w-8
                        h-8
                        rounded-full
                        bg-cyan-400
                        text-slate-950
                        flex
                        items-center
                        justify-center
                        font-bold
                      "
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>

                    <span>
                      {user?.name || 'Profile'}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      text-slate-400
                      hover:text-red-400
                      hover:bg-red-400/5
                      transition
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
                rounded-xl
                border
                border-slate-700
                bg-slate-900/60
                flex
                flex-col
                items-center
                justify-center
                gap-1.5
              "
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  menuOpen
                    ? {
                        rotate: 45,
                        y: 6,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                className="w-5 h-[2px] bg-white rounded-full"
              />

              <motion.span
                animate={
                  menuOpen
                    ? {
                        opacity: 0,
                      }
                    : {
                        opacity: 1,
                      }
                }
                className="w-5 h-[2px] bg-white rounded-full"
              />

              <motion.span
                animate={
                  menuOpen
                    ? {
                        rotate: -45,
                        y: -6,
                      }
                    : {
                        rotate: 0,
                        y: 0,
                      }
                }
                className="w-5 h-[2px] bg-white rounded-full"
              />
            </button>

          </div>

        </div>
      </motion.nav>


      {/* MOBILE MENU */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              fixed
              top-[88px]
              left-0
              right-0
              z-40
              bg-slate-950/95
              backdrop-blur-2xl
              border-b
              border-slate-800
              overflow-hidden
            "
          >
            <div className="px-6 py-7">

              <div className="flex flex-col">

                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: index * 0.04,
                    }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        block
                        py-4
                        border-b
                        border-slate-800/70
                        text-sm
                        font-semibold
                        tracking-[0.15em]
                        ${
                          isActive
                            ? 'text-cyan-400'
                            : 'text-slate-300'
                        }
                      `}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}


                {/* MOBILE AUTH */}

                <div className="pt-6 flex flex-col gap-3">

                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        className="
                          text-center
                          py-3
                          rounded-xl
                          border
                          border-slate-700
                          text-slate-200
                        "
                      >
                        LOGIN
                      </Link>

                      <Link
                        to="/register"
                        className="
                          text-center
                          py-3
                          rounded-xl
                          bg-cyan-400
                          text-slate-950
                          font-bold
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
                          text-center
                          py-3
                          rounded-xl
                          border
                          border-slate-700
                          text-slate-200
                        "
                      >
                        PROFILE
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="
                          py-3
                          rounded-xl
                          border
                          border-red-400/30
                          text-red-400
                        "
                      >
                        LOGOUT
                      </button>
                    </>
                  )}

                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar