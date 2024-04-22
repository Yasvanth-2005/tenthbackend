const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    hallTicketNumber: String,
    result: String,
    father_name: String,
    dist: String,
    marks: {
      telugu: String,
      hindi: String,
      english: String,
      mathematics: String,
      science: String,
      social: String,
      t_pass: String,
      h_pass: String,
      e_pass: String,
      m_pass: String,
      sci_pass: String,
      soc_pass: String,
    },
    total: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
