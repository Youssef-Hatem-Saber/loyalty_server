const Cart = require("../models/cart.model");
const axios = require("axios");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId }).populate("productId");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;

    const items = cartItems.map(item => {
      const price = item.productId.price;
      const qty = item.quantity;
      const total = price * qty;

      totalPrice += total;

      return {
        productId: item.productId._id,
        quantity: qty,
        price: price,
        total: total
      };
    });

    const order = await Order.create({
      userId,
      items,
      totalPrice
    });

const loyaltyResponse = await axios.post(
  "https://loyalty-z748.onrender.com/api/loyalty/add",
  {
    order_total: totalPrice
  },
  {
    headers: {
      Authorization: req.headers.authorization
    }
  }
);


    await Cart.deleteMany({ userId });

    res.status(201).json({
      message: "Order completed",
      order,
      loyalty: loyaltyResponse.data
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getOrder
};
