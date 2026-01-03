const express = require("express");
const Nominee = require("../models/Nominee");
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

// Add nominee (admin only)
router.post("/", auth, adminAuth, async (req, res) => {
  const { name, position } = req.body;
  try {
    const nominee = new Nominee({ name, position, approved: true });
    await nominee.save();
    res.json(nominee);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all approved nominees
router.get("/", async (req, res) => {
  try {
    const nominees = await Nominee.find({ approved: true });
    res.json(nominees);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete (soft remove nominee)
router.delete("/:id", auth, adminAuth, async (req, res) => {
  try {
    await Nominee.findByIdAndUpdate(req.params.id, { approved: false });
    res.json({ msg: "Nominee removed" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Vote for a nominee
router.put("/:id/vote", async (req, res) => {
  try {
    const nominee = await Nominee.findById(req.params.id);
    if (!nominee) {
      return res.status(404).json({ msg: "Nominee not found" });
    }

    nominee.votes = (nominee.votes || 0) + 1;
    await nominee.save();

    res.json(nominee); // return updated nominee
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
