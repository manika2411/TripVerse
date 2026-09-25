const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const currencyRoutes = require("./routes/currencyRoutes");
const countryRoutes = require("./routes/countryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/trips", tripRoutes);

app.use("/api/countries", countryRoutes);

app.use("/api/currency", currencyRoutes);

app.use("/api/budgets", budgetRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TripVerse API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TripVerse backend running on port ${PORT}`);
});