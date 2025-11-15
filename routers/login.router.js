const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login.controller");

// Register
router.post("/register", loginController.register);

// Login
router.post("/login", loginController.login);

// Refresh Token
router.post("/refresh", loginController.refresh);

// Logout
router.post("/logout", loginController.logout);
module.exports = router;
