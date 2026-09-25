const Trip = require("../models/Trip");

const calculateStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < now) {
    return "Completed";
  }

  if (start <= now && end >= now) {
    return "Ongoing";
  }

  return "Upcoming";
};

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    }).sort({
      startDate: 1,
    });

    const updatedTrips = trips.map((trip) => {
      const status = calculateStatus(
        trip.startDate,
        trip.endDate
      );

      if (trip.status !== status) {
        trip.status = status;
        trip.save();
      }

      return {
        ...trip.toObject(),
        status,
      };
    });

    res.status(200).json(updatedTrips);
  } catch (error) {
    console.error("Get trips error:", error);

    res.status(500).json({
      message: "Failed to fetch trips",
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    trip.status = calculateStatus(
      trip.startDate,
      trip.endDate
    );

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error("Get trip error:", error);

    res.status(500).json({
      message: "Failed to fetch trip",
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const {
      tripName,
      destination,
      startDate,
      endDate,
      budget,
      itinerary,
    } = req.body;

    if (
      !tripName ||
      !destination ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        message:
          "Trip name, destination, start date and end date are required",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message:
          "End date cannot be before start date",
      });
    }

    const trip = await Trip.create({
      user: req.user.id,
      tripName,
      destination,
      startDate,
      endDate,
      budget: Number(budget) || 0,
      status: calculateStatus(
        startDate,
        endDate
      ),
      itinerary: Array.isArray(itinerary)
        ? itinerary
        : [],
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error("Create trip error:", error);

    res.status(500).json({
      message: "Failed to create trip",
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    const {
      tripName,
      destination,
      startDate,
      endDate,
      budget,
      itinerary,
    } = req.body;

    if (tripName !== undefined) {
      trip.tripName = tripName;
    }

    if (destination !== undefined) {
      trip.destination = destination;
    }

    if (startDate !== undefined) {
      trip.startDate = startDate;
    }

    if (endDate !== undefined) {
      trip.endDate = endDate;
    }

    if (budget !== undefined) {
      trip.budget = Number(budget) || 0;
    }

    if (itinerary !== undefined) {
      trip.itinerary = itinerary;
    }

    if (
      new Date(trip.endDate) <
      new Date(trip.startDate)
    ) {
      return res.status(400).json({
        message:
          "End date cannot be before start date",
      });
    }

    trip.status = calculateStatus(
      trip.startDate,
      trip.endDate
    );

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    console.error("Update trip error:", error);

    res.status(500).json({
      message: "Failed to update trip",
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error("Delete trip error:", error);

    res.status(500).json({
      message: "Failed to delete trip",
    });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
};