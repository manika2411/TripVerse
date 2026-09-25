const express = require("express");

const {
  fetchCountries,
  fetchCountryByCode,
  fetchCountryByName,
} = require("../controllers/countryController");

const router = express.Router();

router.get("/", fetchCountries);

router.get("/code/:code", fetchCountryByCode);

router.get("/name/:name", fetchCountryByName);

module.exports = router;