const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nominee: { type: mongoose.Schema.Types.ObjectId, ref: "Nominee", required: true },
  position: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Vote", voteSchema);
