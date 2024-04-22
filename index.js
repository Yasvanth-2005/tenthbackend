const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(4002, () => {
      console.log("Server is running on port 4002");
      console.log("Connected to MongoDB successfully");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
