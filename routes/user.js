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
      "NAME",
      "ROLLNO",
      "L1_MRK",
      "L1_RSLT",
      "L2_MRK",
      "L2_RSLT",
      "L3_MRK",
      "L3_RSLT",
      "MAT_MRK",
      "MAT_RSLT",
      "SCI_MRK",
      "SCI_RSLT",
      "SOC_MRK",
      "SOC_RSLT",
      "RESULT",
      "G_TOT",
      "FNAME",
      "DT_NAME",
    ];
    const actualColumns = Object.keys(users[0] || {});
    if (!expectedColumns.every((col) => actualColumns.includes(col))) {
      return res.status(400).json({ message: "Invalid file structure" });
    }

    const mappedUsers = users.map((user) => ({
      name: user.NAME,
      hallTicketNumber: user.ROLLNO,
      result: user.RESULT,
      dist: user.DT_NAME,
      father_name: user.FNAME,
      marks: {
        telugu: user.L1_MRK,
        hindi: user.L2_MRK,
        english: user.L3_MRK,
        mathematics: user.MAT_MRK,
        science: user.SCI_MRK,
        social: user.SOC_MRK,
        t_pass: user.L1_RSLT,
        h_pass: user.L2_RSLT,
        e_pass: user.L3_RSLT,
        m_pass: user.MAT_RSLT,
        sci_pass: user.SCI_RSLT,
        soc_pass: user.SOC_RSLT,
      },
      total: String,
    }));

    await User.create(mappedUsers);
    return res.status(201).json({ message: "Users added successfully" });
  } catch (error) {
    console.error("Error adding users to the database:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/res", async (req, res) => {
  const { hallTicketNumber } = req.body;

  try {
    const user = await User.findOne({ hallTicketNumber });
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
