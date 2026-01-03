const mongoose = require("mongoose");

const NomineeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  votes: { type: Number, default: 0 },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model("Nominee", NomineeSchema);
