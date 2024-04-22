const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const User = require("../models/user.js");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);

    const expectedColumns = [
      "Name",
      "Hallticket_Number",
      "Result",
      "Telugu",
      "Hindi",
      "English",
      "Mathematics",
      "Science",
      "Social",
    ];
    const actualColumns = Object.keys(users[0] || {});
    if (!expectedColumns.every((col) => actualColumns.includes(col))) {
      return res.status(400).json({ message: "Invalid file structure" });
    }

    const mappedUsers = users.map((user) => ({
      name: user.Name,
      hallTicketNumber: user.Hallticket_Number,
      result: user.Result,
      marks: {
        telugu: user.Telugu,
        hindi: user.Hindi,
        english: user.English,
        mathematics: user.Mathematics,
        science: user.Science,
        social: user.Social,
      },
    }));

    await User.create(mappedUsers);
    return res.status(201).json({ message: "Users added successfully" });
  } catch (error) {
    console.error("Error adding users to the database:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/res", async (req, res) => {
  const { ticket } = req.body;

  try {
    const user = await User.findOne({ hallTicketNumber: ticket });
    if (!user) {
      return res.status(200).json({ message: "No User Found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
