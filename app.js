const express = require("express");
const {readData, writeData} = require("./services/dataService");

const app = express();
const itemsRouter = require("./routes/items")
const mongoose = require("mongoose");

const connectionString = "mongodb+srv://djxsrouk:XhyXHdVKDYF2hZcn@goit.gakig.mongodb.net/?retryWrites=true&w=majority&appName=GoIT";
mongoose.connect(connectionString)
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/items", itemsRouter)

app.get("/", async (req, res) => {
    res.json({ status: 200 });
});



const PORT = 3000;
app.listen(PORT, () => {
    {
        console.log(`Server is running on port ${PORT}`);
    }
});