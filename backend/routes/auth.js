const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Only students must follow the email rule
    const studentEmailRegex = /^[a-zA-Z0-9._]+@jietjodhpur\.ac\.in$/;
    if (role === "student" && !studentEmailRegex.test(email)) {
      return res.status(400).json({
        msg: "Invalid student email. Must be in the format name@jietjodhpur.ac.in",
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create user
    user = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role: role || "student", // default to student if not provided
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  console.log("Login request body:", req.body);
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // If student, check email format again (extra safety)
    const studentEmailRegex = /^[a-zA-Z0-9._]+@jietjodhpur\.ac\.in$/;
    if (user.role === "student" && !studentEmailRegex.test(email)) {
      return res.status(400).json({
        msg: "Invalid student email. Must use name@jietjodhpur.ac.in format",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
