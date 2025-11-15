const User = require("../models/user.model");

const getPoints = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      total_points: user.points || 0
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_total } = req.body;

    if (!order_total) {
      return res.status(400).json({ message: "order_total is required" });
    }

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const pointsAdded = Math.round(order_total * 0.1);

    user.points = (user.points || 0) + pointsAdded;
    await user.save();

    res.status(200).json({
      message: "Points added successfully",
      points_added: pointsAdded,
      total_points: user.points
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPoints,
  addPoints
};
