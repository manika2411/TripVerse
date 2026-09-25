const {
  getCountries,
  getCountryByCode,
  getCountryByName,
} = require("../services/countryService");

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

    res.status(500).json({
      success: false,
      message: "Unable to fetch countries",
      error: error.message,
    });
  }
};

const fetchCountryByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const country = await getCountryByCode(code);

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error("Country lookup error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const fetchCountryByName = async (req, res) => {
  try {
    const { name } = req.params;

    const country = await getCountryByName(name);

    res.status(200).json({
      success: true,
      data: country,
    });
  } catch (error) {
    console.error("Country name lookup error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  fetchCountries,
  fetchCountryByCode,
  fetchCountryByName,
};
