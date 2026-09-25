import { useEffect, useMemo, useState } from "react";
import { getCountries } from "../services/countryApi";
import { getExchangeRate } from "../services/currencyApi";
import { saveBudget, getBudgetByDestination } from "../services/budgetApi";

function BudgetPlanner() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [budget, setBudget] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  const [expenses, setExpenses] = useState({
    accommodation: "",
    food: "",
    transport: "",
    activities: "",
    shopping: "",
    other: "",
  });

  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("");
  const [conversionAmount, setConversionAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCountries();

        setCountries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Budget country loading error:", err);
        setError("Unable to load destinations.");
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const handleSaveBudget = async () => {
    if (!selectedCountry) {
      setSaveError("Please select a destination.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setSaveError("Please enter a valid trip budget.");
      return;
    }

    if (!currency) {
      setSaveError("Currency could not be determined.");
      return;
    }

    const country = countries.find(
      (item) => getCountryCode(item) === selectedCountry,
    );

    const destination = getCountryName(country);

    try {
      setSaveLoading(true);
      setSaveMessage("");
      setSaveError("");

      await saveBudget({
        destination,
        destinationCode: selectedCountry,
        currency,
        budget: Number(budget),
        expenses: {
          accommodation: Number(expenses.accommodation) || 0,
          food: Number(expenses.food) || 0,
          transport: Number(expenses.transport) || 0,
          activities: Number(expenses.activities) || 0,
          shopping: Number(expenses.shopping) || 0,
          other: Number(expenses.other) || 0,
        },
      });

      setSaveMessage("Budget saved successfully.");
    } catch (err) {
      console.error("Budget save error:", err);

      setSaveError(err.message || "Unable to save budget.");
    } finally {
      setSaveLoading(false);
    }
  };

  const getCountryName = (country) => {
    return (
      country?.name?.common ||
      country?.names?.common ||
      country?.name ||
      "Unknown"
    );
  };

  const getCountryCode = (country) => {
    return (
      country?.cca3 ||
      country?.codes?.alpha3 ||
      country?.code ||
      country?.codes?.cca3 ||
      ""
    );
  };

  const getCountryCurrency = (country) => {
    if (!country) return "";

    if (country.currencies) {
      if (Array.isArray(country.currencies)) {
        const firstCurrency = country.currencies[0];

        if (typeof firstCurrency === "string") {
          return firstCurrency;
        }

        if (firstCurrency?.code) {
          return firstCurrency.code;
        }
      }

      if (typeof country.currencies === "object") {
        const codes = Object.keys(country.currencies);

        if (codes.length > 0) {
          return codes[0];
        }
      }
    }

    if (country.currency) {
      if (typeof country.currency === "string") {
        return country.currency;
      }

      if (country.currency?.code) {
        return country.currency.code;
      }

      if (typeof country.currency === "object") {
        const codes = Object.keys(country.currency);

        if (codes.length > 0) {
          return codes[0];
        }
      }
    }

    if (country.currencyCode) {
      return country.currencyCode;
    }

    if (country.currency_code) {
      return country.currency_code;
    }

    return "";
  };

  const getCurrencySymbol = (currencyCode) => {
    if (!currencyCode) return "";

    try {
      const parts = new Intl.NumberFormat("en", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).formatToParts(0);

      return (
        parts.find((part) => part.type === "currency")?.value || currencyCode
      );
    } catch {
      return currencyCode;
    }
  };

  const handleCountryChange = async (e) => {
    const code = e.target.value;

    setSelectedCountry(code);

    const country = countries.find((item) => getCountryCode(item) === code);

    const countryCurrency = getCountryCurrency(country);

    setCurrency(countryCurrency);
    setCurrencySymbol(getCurrencySymbol(countryCurrency));
    setToCurrency(countryCurrency);

    setSaveMessage("");
    setSaveError("");

    if (!code) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const savedBudget = await getBudgetByDestination(code);

      if (!savedBudget) return;

      setBudget(savedBudget.budget?.toString() || "");

      setExpenses({
        accommodation: savedBudget.expenses?.accommodation?.toString() || "",
        food: savedBudget.expenses?.food?.toString() || "",
        transport: savedBudget.expenses?.transport?.toString() || "",
        activities: savedBudget.expenses?.activities?.toString() || "",
        shopping: savedBudget.expenses?.shopping?.toString() || "",
        other: savedBudget.expenses?.other?.toString() || "",
      });

      setSaveMessage("Saved budget loaded.");
    } catch (err) {
      console.error("Load saved budget error:", err);
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;

    setExpenses((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const totalExpenses = useMemo(() => {
    return Object.values(expenses).reduce(
      (total, value) => total + (Number(value) || 0),
      0,
    );
  }, [expenses]);

  const remainingBudget = (Number(budget) || 0) - totalExpenses;

  const expensePercentage = (value) => {
    if (!totalExpenses) return 0;

    return Math.min(
      100,
      Math.round(((Number(value) || 0) / totalExpenses) * 100),
    );
  };

  const handleConvert = async () => {
    if (!conversionAmount || Number(conversionAmount) < 0) {
      setConversionError("Enter a valid amount.");
      return;
    }

    if (!fromCurrency || !toCurrency) {
      setConversionError("Select both currencies.");
      return;
    }

    try {
      setConversionLoading(true);
      setConversionError("");

      const result = await getExchangeRate(fromCurrency, toCurrency);

      const rate = Number(result.rate);

      setExchangeRate(rate);

      setConvertedAmount(Number(conversionAmount) * rate);
    } catch (err) {
      console.error("Currency conversion error:", err);

      setConvertedAmount(null);
      setExchangeRate(null);
      setConversionError(err.message || "Unable to convert currency.");
    } finally {
      setConversionLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    const previousFrom = fromCurrency;

    setFromCurrency(toCurrency);
    setToCurrency(previousFrom);

    setConvertedAmount(null);
    setExchangeRate(null);
    setConversionError("");
  };

  const displayCurrency = currencySymbol || currency || "—";

  const currencyOptions = [
    "INR",
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "AUD",
    "CAD",
    "CHF",
    "SGD",
    "AED",
    "CNY",
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-cyan-500 uppercase tracking-[5px] font-semibold text-sm mb-3">
            Travel Finance
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                Budget Planner
              </h1>

              <p className="text-slate-500 text-lg mt-4 max-w-2xl">
                Plan your trip expenses, track your spending and understand your
                travel budget in local currency.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
              <p className="text-sm text-slate-500">Remaining Budget</p>

              <p
                className={`text-3xl font-extrabold mt-1 ${
                  remainingBudget < 0 ? "text-red-500" : "text-cyan-500"
                }`}
              >
                {displayCurrency} {Math.abs(remainingBudget).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5 mb-8">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Trip Details</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Destination
                  </label>

                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    disabled={loading}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="">
                      {loading
                        ? "Loading destinations..."
                        : "Select destination"}
                    </option>

                    {countries.map((country, index) => {
                      const code = getCountryCode(country);
                      const name = getCountryName(country);

                      return (
                        <option key={code || index} value={code}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Destination Currency
                  </label>

                  <div className="w-full p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-cyan-500">
                        {currencySymbol || "—"}
                      </span>

                      <span className="text-slate-700 font-semibold">
                        {currency || "Select a destination"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Total Trip Budget
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                      {displayCurrency}
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Enter your budget"
                      className="w-full p-4 pl-16 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                <div>
                  <h2 className="text-2xl font-bold">Expense Breakdown</h2>

                  <p className="text-slate-500 mt-1">
                    Estimate how much you plan to spend in each category.
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-500">Total Expenses</p>

                  <p className="text-2xl font-extrabold">
                    {displayCurrency} {totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handleSaveBudget}
                  disabled={saveLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition"
                >
                  {saveLoading ? "Saving Budget..." : "Save Budget"}
                </button>

                {saveMessage && (
                  <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm">
                    {saveMessage}
                  </div>
                )}

                {saveError && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                    {saveError}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {[
                  ["accommodation", "Accommodation"],
                  ["food", "Food & Dining"],
                  ["transport", "Transport"],
                  ["activities", "Activities"],
                  ["shopping", "Shopping"],
                  ["other", "Other"],
                ].map(([name, label]) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {label}
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                        {displayCurrency}
                      </span>

                      <input
                        type="number"
                        min="0"
                        name={name}
                        value={expenses[name]}
                        onChange={handleExpenseChange}
                        placeholder="0"
                        className="w-full p-4 pl-16 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>

                    <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${expensePercentage(expenses[name])}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-5">
                <div className="bg-slate-50 rounded-2xl p-5">
                  <p className="text-sm text-slate-500">Planned Budget</p>

                  <p className="text-2xl font-bold mt-2">
                    {displayCurrency} {(Number(budget) || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-cyan-50 rounded-2xl p-5">
                  <p className="text-sm text-cyan-700">Total Expenses</p>

                  <p className="text-2xl font-bold text-cyan-700 mt-2">
                    {displayCurrency} {totalExpenses.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`rounded-2xl p-5 ${
                    remainingBudget < 0 ? "bg-red-50" : "bg-emerald-50"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      remainingBudget < 0 ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    {remainingBudget < 0 ? "Over Budget" : "Remaining"}
                  </p>

                  <p
                    className={`text-2xl font-bold mt-2 ${
                      remainingBudget < 0 ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    {displayCurrency}{" "}
                    {Math.abs(remainingBudget).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
              <div className="mb-7">
                <p className="text-cyan-500 uppercase tracking-[3px] text-xs font-bold mb-2">
                  Live Conversion
                </p>

                <h2 className="text-2xl font-bold">Currency Converter</h2>

                <p className="text-slate-500 mt-1">
                  Check what your money is worth in another currency.
                </p>
              </div>

              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={conversionAmount}
                      onChange={(e) => {
                        setConversionAmount(e.target.value);
                        setConvertedAmount(null);
                      }}
                      placeholder="Amount"
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />

                    <select
                      value={fromCurrency}
                      onChange={(e) => {
                        setFromCurrency(e.target.value);
                        setConvertedAmount(null);
                      }}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400"
                    >
                      {currencyOptions.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSwapCurrencies}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-700 hover:text-cyan-600 transition flex items-center justify-center font-bold text-xl"
                >
                  ⇄
                </button>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    To
                  </label>

                  <select
                    value={toCurrency}
                    onChange={(e) => {
                      setToCurrency(e.target.value);
                      setConvertedAmount(null);
                    }}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-cyan-400"
                  >
                    <option value="">Select currency</option>

                    {currencyOptions.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={conversionLoading}
                className="w-full mt-5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-60 text-slate-900 py-4 rounded-xl font-bold transition"
              >
                {conversionLoading ? "Converting..." : "Convert Currency"}
              </button>

              {conversionError && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                  {conversionError}
                </div>
              )}

              {convertedAmount !== null && exchangeRate !== null && (
                <div className="mt-6 bg-slate-50 rounded-2xl p-6">
                  <p className="text-sm text-slate-500">Converted Amount</p>

                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mt-2">
                    <p className="text-4xl font-extrabold text-cyan-500">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: toCurrency,
                        maximumFractionDigits: 2,
                      }).format(convertedAmount)}
                    </p>

                    <p className="text-sm text-slate-500">
                      1 {fromCurrency} ={" "}
                      {exchangeRate.toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}{" "}
                      {toCurrency}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default BudgetPlanner;
