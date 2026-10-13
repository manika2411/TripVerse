const express = require("express");

const router = express.Router();

router.get("/rate", async (req, res) => {
  try {
    const from = String(req.query.from || "").trim().toUpperCase();
    const to = String(req.query.to || "").trim().toUpperCase();

    if (!/^[A-Z]{3}$/.test(from) || !/^[A-Z]{3}$/.test(to)) {
      return res.status(400).json({
        success: false,
        message: "from and to must be 3-letter currency codes",
      });
    }

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both from and to currencies are required",
      });
    }

    if (from === to) {
      return res.json({
        success: true,
        data: {
          from,
          to,
          rate: 1,
        },
      });
    }

    const response = await fetch(
      `https://api.frankfurter.dev/v2/rate/${from}/${to}`
    );

    const data = await response.json();

    if (!response.ok || !data.rate) {
      return res.status(400).json({
        success: false,
        message: "Unable to fetch exchange rate",
      });
    }

    res.json({
      success: true,
      data: {
        from,
        to,
        rate: data.rate,
      },
    });
  } catch (error) {
    console.error("Currency API error:", error);

    res.status(500).json({
      success: false,
      message: "Currency conversion failed",
    });
  }
});

module.exports = router;