const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dataFile = path.join(__dirname, "data.json");

const readData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFile, "utf-8", (error, data) => {
            if (error) {
                reject(error);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (data) {
                    reject(data);
                }
            }
        });
    });
};

const writeData = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFile, JSON.stringify(data, null, 4), "utf-8", (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

app.get("/", async (req, res) => {
    res.json({ status: 200 });
});

app.get("/items", async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error!"});
    }
});


app.post("/items", async (req, res) => {
    try {
        const data = await readData(); 
        const newItem = { id: data.length + 1, value: req.body.title };
        data.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error!"});
    }
})

app.put("/items/:id", async (req, res) => {
    try {
        const data = await readData();
        const itemId = parseInt(req.params.id, 10);
        const updatedValue = req.body.title;

        const itemIndex = data.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            data[itemIndex].value = updatedValue;
            await writeData(data);
            res.json(data[itemIndex]);
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error!" });
    }
});


app.delete("/items/:id", async (req, res) => {
    try {
        const data = await readData();
        const itemId = parseInt(req.params.id, 10);

        const newData = data.filter(item => item.id !== itemId);

        if (newData.length !== data.length) {
            await writeData(newData);
            res.json({ message: "Item deleted successfully" });
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    {
        console.log(`Server is running on port ${PORT}`);
    }
});