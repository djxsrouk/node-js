const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const itemsRouter = require("./routes/items")
const authRouter = require("./routes/auth");

const passport = require("passport");
require("./config/passport")(passport);

const connectionString = "mongodb+srv://djxsrouk:XhyXHdVKDYF2hZcn@goit.gakig.mongodb.net/?retryWrites=true&w=majority&appName=GoIT";
mongoose.connect(connectionString)
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/items", itemsRouter)
app.use("/auth", authRouter);

app.get("/", async (req, res) => {
    res.json({ status: 200 });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: "error",
        code: err.status || 500,
        message: err.message,
        data: err.data || "Internal Server Error",
    });
})



const PORT = 3000;
app.listen(PORT, () => {
    {
        console.log(`Server is running on port ${PORT}`);
    }
});