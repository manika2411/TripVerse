const Trip = require('../models/Trip')

// Create Trip
exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({
      ...req.body,
      user: req.user.id,
    })

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// Get All Trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    }).sort({ createdAt: -1 })

    res.json(trips)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// Get Single Trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// Update Trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    )

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// Delete Trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    })

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    res.json({
      message: 'Trip deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}