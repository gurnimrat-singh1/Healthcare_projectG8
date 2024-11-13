const express = require("express");
const router = express.Router();
const {genrateToken, validateJwtToken } = require("../middlewares/jwtMiddleware"); // Correct import

const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/userController");

// Define routes
router.post("/", registerUser);                   // Registration route
router.post("/login", genrateToken,loginUser); // Login route with JWT middleware

router.get("/myaccount",validateJwtToken,getUserProfile)//route for get user specific data

router.patch("/myaccount",validateJwtToken,updateUserProfile)//route for updating the user specific data

module.exports = router;
