const User = require("../models/User");

const FIELD_LIMITS = {
  name: 60,
  bio: 500,
  country: 60,
  avatar: 2000,
};

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to load profile",
    });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const updates = {};

    // Validate every field the client sent: it must be a string, it is trimmed,
    // and it must fit the limit. Clear 400s instead of leaking database errors.
    for (const field of Object.keys(FIELD_LIMITS)) {
      const value = req.body[field];

      if (value === undefined) continue;

      if (typeof value !== "string") {
        return res.status(400).json({
          message: `${field} must be text`,
        });
      }

      const cleaned = value.trim();

      if (field === "name" && !cleaned) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      if (cleaned.length > FIELD_LIMITS[field]) {
        return res.status(400).json({
          message: `${field} must be ${FIELD_LIMITS[field]} characters or fewer`,
        });
      }

      updates[field] = cleaned;
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    Object.assign(user, updates);

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      bio: updatedUser.bio,
      country: updatedUser.country,
      avatar: updatedUser.avatar,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
