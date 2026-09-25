const User = require('../models/User')

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password'
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      country,
      avatar,
    } = req.body

    const user = await User.findById(
      req.user.id
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (name !== undefined) {
      user.name = name
    }

    if (bio !== undefined) {
      user.bio = bio
    }

    if (country !== undefined) {
      user.country = country
    }

    if (avatar !== undefined) {
      user.avatar = avatar
    }

    const updatedUser = await user.save()

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      country: updatedUser.country,
      avatar: updatedUser.avatar,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  getProfile,
  updateProfile,
}