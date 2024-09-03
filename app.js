const path = require("path");
const fs = require("fs").promises;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const multer = require("multer");
const xlsx = require("xlsx");

require("dotenv").config();
require("./config/passport")(passport);

const app = express();

// MongoDB Connection
const connectionString = process.env.MONGO_URI;
mongoose.connect(connectionString)
    .then(() => console.log("Your MongoDB database is connected..."))
    .catch(err => console.log(err));

// Import Routes
const itemsRouter = require("./routes/items");
const authRouter = require("./routes/auth");


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/items", itemsRouter);
app.use("/auth", authRouter);

app.get("/", async (req, res) => {
    res.json({ status: 200 });
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack); // Logs the error stack trace
    res.status(err.status || 500).json({
        status: "error",
        code: err.status || 500,
        message: err.message,
        data: err.data || "Internal Server Error",
    });
});

// Server Initialization
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
