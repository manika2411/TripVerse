import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "EXPLORE", path: "/explore" },
    { name: "PLANNER", path: "/planner" },
    { name: "BUDGET", path: "/budget-planner" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "COMMUNITY", path: "/community" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const lightMode = !isHome || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] w-full border-b backdrop-blur-xl transition-all duration-500 ease-out ${
        lightMode
          ? "border-slate-200/70 bg-white/90 text-slate-900 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
          : "border-white/10 bg-slate-950/35 text-white"
      }`}
    >
      <div className="mx-auto flex h-[84px] w-full max-w-[1680px] items-center gap-8 px-5 sm:px-8 lg:px-10 2xl:px-14">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="TripVerse Home"
          className="group flex shrink-0 items-center border-0 bg-transparent p-0 leading-none"
        >
          <span
            className={`text-[32px] font-extrabold tracking-[-2px] transition-colors duration-300 sm:text-[36px] ${
              lightMode ? "text-slate-950" : "text-white"
            }`}
          >
            Trip
          </span>
          <span className="text-[32px] font-extrabold tracking-[-2px] text-cyan-500 transition-colors duration-300 group-hover:text-cyan-400 sm:text-[36px]">
            Verse
          </span>
        </button>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex 2xl:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative whitespace-nowrap px-3 py-3 text-[14px] font-bold tracking-[0.04em] transition-colors duration-300 2xl:px-3.5 2xl:text-[15px] ${
                  isActive
                    ? "text-cyan-500"
                    : lightMode
                      ? "text-slate-600 hover:text-cyan-500"
                      : "text-white/80 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-cyan-400 transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`rounded-full px-4 py-3 text-[14px] font-bold transition-colors duration-300 ${
              location.pathname === "/profile"
                ? "text-cyan-500"
                : lightMode
                  ? "text-slate-700 hover:text-cyan-500"
                  : "text-white/85 hover:text-white"
            }`}
          >
            PROFILE
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className={`rounded-full border px-5 py-3 text-[14px] font-bold transition-all duration-300 ${
              lightMode
                ? "border-slate-300 bg-white/70 text-slate-800 hover:border-cyan-300 hover:text-cyan-600"
                : "border-white/25 bg-white/5 text-white hover:border-cyan-300 hover:text-cyan-300"
            }`}
          >
            LOGOUT
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          className={`ml-auto flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl border xl:hidden ${
            lightMode
              ? "border-slate-200 bg-white text-slate-900"
              : "border-white/20 bg-white/10 text-white"
          }`}
        >
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
          <span className="h-0.5 w-5 rounded-full bg-current" />
        </button>
      </div>

      <div
        className={`overflow-hidden border-t transition-all duration-300 xl:hidden ${
          lightMode ? "border-slate-200 bg-white/95" : "border-white/10 bg-slate-950/95"
        } ${menuOpen ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <nav className="mx-auto flex max-w-3xl flex-col gap-1 px-6 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-cyan-50 text-cyan-600"
                    : lightMode
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className={`rounded-xl px-4 py-3 text-left text-sm font-bold ${
              lightMode ? "text-slate-700" : "text-white/80"
            }`}
          >
            PROFILE
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl px-4 py-3 text-left text-sm font-bold text-red-500"
          >
            LOGOUT
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
