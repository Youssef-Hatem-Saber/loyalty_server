const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../middleware/auth.middleware");

router.post("/add", auth, cartController.addToCart);

router.get("/", auth, cartController.getCart);

router.put("/update/:id", auth, cartController.updateQuantity);

router.delete("/remove/:id", auth, cartController.removeItem);

router.delete("/clear", auth, cartController.clearCart);

module.exports = router;
