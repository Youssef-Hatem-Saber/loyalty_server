const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/loyalty.controller");
const auth = require("../middleware/auth.middleware");

router.get("/points", auth, loyaltyController.getPoints);

router.post("/add", auth, loyaltyController.addPoints);

module.exports = router;
