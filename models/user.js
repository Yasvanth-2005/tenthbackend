const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    hallTicketNumber: String,
    result: String,
    marks: {
      telugu: String,
      hindi: String,
      english: String,
      mathematics: String,
      science: String,
      social: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
