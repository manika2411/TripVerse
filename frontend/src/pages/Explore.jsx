import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCountries } from "../services/countryApi";

function Explore() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCountryName = (country) => {
    return (
      country?.name?.common ||
      country?.names?.common ||
      country?.name ||
      "Unknown"
    );
  };

  const getCountryOfficialName = (country) => {
    return (
      country?.name?.official ||
      country?.names?.official ||
      getCountryName(country)
    );
  };

  const getCountryCode = (country) => {
    return (
      country?.cca3 ||
      country?.codes?.alpha_3 ||
      country?.cca2 ||
      country?.codes?.alpha_2 ||
      ""
    );
  };

  const getCountryFlag = (country) => {
    return country?.flags?.svg || country?.flags?.png || country?.flag || "";
  };

  const getCountryRegion = (country) => {
    return country?.region || "Other";
  };

  const getCountrySubregion = (country) => {
    return country?.subregion || country?.subregions?.[0] || "";
  };

  const getCountryCapital = (country) => {
    return country?.capital?.[0] || country?.capitals?.[0] || "Not available";
  };

  const getCountryCurrency = (country) => {
    const currencies = country?.currencies || {};

    const values = Object.values(currencies);

    if (!values.length) {
      return "Not available";
    }

    const currency = values[0];

    if (typeof currency === "string") {
      return currency;
    }

    return currency?.name || currency?.symbol || "Not available";
  };

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCountries();

      if (!Array.isArray(data)) {
        throw new Error("Invalid country data received.");
      }

      setCountries(data);
    } catch (err) {
      console.error("Explore countries error:", err);

      setError(
        err?.message || "Unable to load destinations. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return countries.filter((country) => {
      const name = getCountryName(country).toLowerCase();

      const officialName = getCountryOfficialName(country).toLowerCase();

      const countryRegion = getCountryRegion(country);

      const subregion = getCountrySubregion(country).toLowerCase();

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        officialName.includes(searchValue) ||
        subregion.includes(searchValue);

      const matchesRegion = region === "All" || countryRegion === region;

      return matchesSearch && matchesRegion;
    });
  }, [countries, search, region]);

  const clearFilters = () => {
    setSearch("");
    setRegion("All");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <div className="h-4 w-36 rounded-full bg-slate-200 animate-pulse mb-5" />

            <div className="h-14 md:h-20 w-3/4 max-w-3xl rounded-2xl bg-slate-200 animate-pulse mb-6" />

            <div className="h-5 w-full max-w-2xl rounded-full bg-slate-200 animate-pulse" />
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-14">
            <div className="h-14 w-full md:w-96 bg-white border border-slate-200 rounded-2xl animate-pulse" />

            <div className="h-14 w-full md:w-52 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
              >
                <div className="h-56 bg-slate-200 animate-pulse" />

                <div className="p-6">
                  <div className="h-6 w-3/4 bg-slate-200 rounded mb-4 animate-pulse" />

                  <div className="h-4 w-1/2 bg-slate-200 rounded mb-3 animate-pulse" />

                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center py-24 bg-white border border-red-100 rounded-[2rem] shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl">
              !
            </div>

            <p className="uppercase tracking-[5px] text-cyan-600 text-sm font-bold mb-4">
              Destinations
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Something went wrong
            </h1>

            <p className="text-slate-500 text-lg mb-8">
              Unable to load destinations. Please try again.
            </p>

            <button
              onClick={fetchCountries}
              className="px-7 py-3.5 rounded-full bg-slate-950 text-white font-bold hover:bg-cyan-500 hover:text-slate-950 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-[2px] bg-cyan-500" />

            <p className="uppercase tracking-[5px] text-cyan-600 text-sm font-bold">
              Explore The World
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight text-slate-950 leading-[0.95]">
                Discover
                <br />
                <span className="text-cyan-500">somewhere new.</span>
              </h1>

              <p className="mt-7 text-slate-500 text-lg md:text-xl max-w-2xl leading-8">
                Explore countries, discover cultures, and find the destination
                that matches your next adventure.
              </p>
            </div>

            <div className="shrink-0">
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
                <p className="text-sm text-slate-400 mb-1">Destinations</p>

                <p className="text-3xl font-black text-slate-950">
                  {filteredCountries.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="bg-white border border-slate-200 rounded-3xl p-4 md:p-5 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">

              <div className="relative flex-1">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full h-14 pl-14 pr-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all"
                />
              </div>

              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="h-14 lg:w-56 px-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all cursor-pointer"
              >
                <option value="All">All Regions</option>

                <option value="Africa">Africa</option>

                <option value="Americas">Americas</option>

                <option value="Asia">Asia</option>

                <option value="Europe">Europe</option>

                <option value="Oceania">Oceania</option>
              </select>

              {(search || region !== "All") && (
                <button
                  onClick={clearFilters}
                  className="h-14 px-6 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between mb-7">
          <div>
            <p className="text-slate-900 font-bold">
              {search || region !== "All"
                ? "Filtered destinations"
                : "All destinations"}
            </p>

            <p className="text-sm text-slate-400 mt-1">
              {filteredCountries.length} places to explore
            </p>
          </div>

          {search && (
            <p className="text-sm text-slate-400">
              Searching for{" "}
              <span className="font-semibold text-slate-700">"{search}"</span>
            </p>
          )}
        </div>

        {filteredCountries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[2rem] py-24 px-6 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cyan-50 text-cyan-500 flex items-center justify-center text-2xl">
              ?
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              No destinations found
            </h2>

            <p className="text-slate-500 mb-7">
              Try another country name or change the region filter.
            </p>

            <button
              onClick={clearFilters}
              className="px-7 py-3 rounded-full bg-slate-950 text-white font-semibold hover:bg-cyan-500 hover:text-slate-950 transition-all"
            >
              Reset Search
            </button>
          </div>
        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country) => {
              const name = getCountryName(country);

              const officialName = getCountryOfficialName(country);

              const code = getCountryCode(country);

              const flag = getCountryFlag(country);

              const countryRegion = getCountryRegion(country);

              const subregion = getCountrySubregion(country);

              const capital = getCountryCapital(country);

              const currency = getCountryCurrency(country);

              return (
                <Link
                  key={code || name}
                  to={`/destination/${code || encodeURIComponent(name)}`}
                  className="group"
                >
                  <article className="h-full bg-white rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden bg-slate-100">
                      {flag ? (
                        <img
                          src={flag}
                          alt={`${name} flag`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          No flag available
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-70" />

                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 shadow-sm">
                          {countryRegion}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-900 group-hover:bg-cyan-400 group-hover:rotate-45 transition-all duration-300 shadow-sm">
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-extrabold text-slate-950 leading-tight group-hover:text-cyan-600 transition-colors">
                        {name}
                      </h2>

                      {officialName !== name && (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                          {officialName}
                        </p>
                      )}

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-slate-400">
                            Capital
                          </span>

                          <span className="text-sm font-semibold text-slate-700 text-right">
                            {capital}
                          </span>
                        </div>

                        <div className="h-px bg-slate-100" />

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-slate-400">Region</span>

                          <span className="text-sm font-semibold text-slate-700">
                            {countryRegion}
                          </span>
                        </div>

                        {subregion && (
                          <>
                            <div className="h-px bg-slate-100" />

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-sm text-slate-400">
                                Area
                              </span>

                              <span className="text-sm font-semibold text-slate-700 text-right">
                                {subregion}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="h-px bg-slate-100" />

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-slate-400">
                            Currency
                          </span>

                          <span className="text-sm font-semibold text-slate-700 text-right">
                            {currency}
                          </span>
                        </div>
                      </div>

                      <div className="mt-7 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                          Explore destination
                        </span>

                        <span className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-all duration-300">
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14" />
                            <path d="m13 6 6 6-6 6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default Explore;
