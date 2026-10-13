const {
  CountryInputError,
  CountryNotFoundError,
  getCountries,
  getCountryByCode,
  getCountryByName,
} = require("../services/countryService");

// Anything that is not "bad input" or "not found" is OUR problem (missing API
// key, upstream outage, ...). Log the details for developers, but never send
// them to the browser.
const sendLookupError = (res, error, label) => {
  if (error instanceof CountryInputError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof CountryNotFoundError) {
    return res.status(404).json({
      success: false,
      message: "Country not found",
    });
  }

  console.error(`${label}:`, error);

  return res.status(502).json({
    success: false,
    message: "Country service is temporarily unavailable",
  });
};

const fetchCountries = async (req, res) => {
  try {
    const countries = await getCountries();

    res.status(200).json({
      success: true,
      count: countries.length,
      data: countries,
    });
  } catch (error) {
    console.error("Country API error:", error);

    res.status(502).json({
      success: false,
      message: "Unable to fetch countries right now",
    });
  }
};

const fetchCountryByCode = async (req, res) => {
  try {
    const country = await getCountryByCode(req.params.code);

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    sendLookupError(res, error, "Country lookup error");
  }
};

const fetchCountryByName = async (req, res) => {
  try {
    const country = await getCountryByName(req.params.name);

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    sendLookupError(res, error, "Country name lookup error");
  }
};

module.exports = {
  fetchCountries,
  fetchCountryByCode,
  fetchCountryByName,
};
