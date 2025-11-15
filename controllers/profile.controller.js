const User = require("../models/user.model");

const profile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId).select("-password -refreshToken");

    res.json({
      message: "Profile fetched",
      user
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { profile };
