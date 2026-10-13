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
const communityRoutes = require("./routes/communityRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// Allowed browser origins. Set CLIENT_URL in .env for production, e.g.
// CLIENT_URL=https://tripverse.example.com  (comma-separate several origins).
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
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

app.use("/api/community", communityRoutes);

app.use("/api/recommendations", recommendationRoutes);
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TripVerse API Running",
  });
});

// Must come after every route.
app.use("/api", notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TripVerse backend running on port ${PORT}`);
});