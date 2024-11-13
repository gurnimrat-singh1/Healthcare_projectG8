const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../model/userModel"); // Corrected variable name to 'User'
require("dotenv").config();

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber, password } = req.body;

    // Validate all required fields
    if (!firstName || !lastName || !age || !gender || !bloodGroup || !email || !phoneNumber || !password) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = await User.create({
        firstName,
        lastName,
        age,
        gender,
        bloodGroup,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
});
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }
  
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    // Check if the password matches (using bcrypt to compare hashed passwords)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    // If login is successful, send a response (no token, just user details)
    res.status(200).json({
      message: "Login successful",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  });

  // Get the current user's profile
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;  // The user ID comes from the JWT token validation middleware

  const user = await User.findById(userId).select("-password"); // Exclude password
  if (!user) {
      res.status(404);
      throw new Error("User not found");
  }

  res.status(200).json({
      message: "User profile fetched successfully",
      user,
  });
});

// Update the current user's profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;  // The user ID comes from the JWT token validation middleware
  const { firstName, lastName, age, gender, bloodGroup, email, phoneNumber } = req.body;

  const user = await User.findById(userId);
  if (!user) {
      res.status(404);
      throw new Error("User not found");
  }

  // Update the user's profile
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.age = age || user.age;
  user.gender = gender || user.gender;
  user.bloodGroup = bloodGroup || user.bloodGroup;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;

  await user.save();

  res.status(200).json({
      message: "User profile updated successfully",
      user,
  });
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };