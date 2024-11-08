const express = require("express");
const router = express.Router();
const { validateJwtToken } = require("../middlewares/jwtMiddleware"); // Correct import

const {
    registerUser,
    loginUser
} = require("../controllers/userController");

// Define routes
router.post("/", registerUser);                   // Registration route
router.post("/login", validateJwtToken, loginUser); // Login route with JWT middleware

module.exports = router;
