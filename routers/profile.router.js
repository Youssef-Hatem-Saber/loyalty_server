const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, profileController.profile);

module.exports = router;
