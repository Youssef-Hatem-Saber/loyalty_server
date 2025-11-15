const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middleware/auth.middleware");

router.post("/checkout", auth, orderController.checkout);

router.get("/", auth, orderController.getMyOrders);

router.get("/:id", auth, orderController.getOrder);

module.exports = router;
