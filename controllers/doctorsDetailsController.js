const asyncHandler = require("express-async-handler");
const Doctor = require("../model/doctorDetailsModel"); // Make sure to create this model
require("dotenv").config();

const registerDoctor = asyncHandler(async (req, res) => {
    const { name, email, speciality, phoneNumber, experience, address } = req.body;

    // Validate all required fields
    if (!name || !email || !speciality || !phoneNumber || !experience || !address) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    // Check if the doctor already exists
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists) {
        return res.status(400).json({ message: "Doctor already exists" });
    }

    // Create a new doctor
    const newDoctor = await Doctor.create({
        name,
        email,
        speciality,
        phoneNumber,
        experience,
        address,
    });

    res.status(201).json({ message: "Doctor registered successfully", doctor: newDoctor });
});

const deleteDoctor = asyncHandler(async (req, res) => {
    const { email } = req.params; // Get the email from the request parameters

    // Find the doctor by email and delete
    const doctor = await Doctor.findOneAndDelete({ email });
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
});

// Function to get all doctors
const getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await Doctor.find(); // Fetch all doctors from the database
    res.status(200).json(doctors); // Send back the list of doctors
});

// Function to get a doctor by email
const getDoctorByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params; // Get the email from the request parameters

    const doctor = await Doctor.findOne({ email }); // Find the doctor by email
    if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" }); // Handle case where doctor is not found
    }

    res.status(200).json(doctor); // Send back the doctor's details
});

// Export functions
module.exports = { registerDoctor, deleteDoctor, getAllDoctors, getDoctorByEmail };