const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Item = require("../models/Items");
const passport = require("passport");
const path = require("path");
const fs = require("fs").promises;
const multer = require("multer");
const xlsx = require("xlsx");

const itemSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().required(),
    imageLink: Joi.string().uri(),
});

const itemsSchema = Joi.array().items(itemSchema);


// Multer Configuration for File Uploads
const uploadDir = path.join(process.cwd(), "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});
const upload = multer({ storage });


const auth = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user) => {
        console.log(user);
        if (!user || err) {
            const error = new Error("Unauthorized");
            error.status = 401;
            return next(error);
        }
        req.user = user;
        next();
    })(req, res, next);
};

router.get("/", auth, async (req, res) => {
    try {
        // const data = await readData();
        const { priceMin = 0, priceMax = Math.min() } = req.query;
        const data = await Item.find({
            price: {
                $gte: priceMin,
                $lte: priceMax,
            },
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const { error } = itemSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }

        // const data = await readData();
        // const newItem = { id: Date.now(), ...req.body };
        // data.push(newItem);
        // await writeData(data);

        const newItem = new Item(req.body);
        await newItem.save();

        res.status(201).send();
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { error } = itemSchema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
        }

        // const data = await readData();
        // const itemId = parseInt(req.params.id, 10);
        // const itemIndex = data.findIndex(item => item.id === itemId);
        // if (itemIndex === -1) {
        //   return res.status(404).json({ error: "Item not found" });
        // }
        // data[itemIndex] = { ...data[itemIndex], ...req.body };
        // await writeData(data);

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedItem) {
            res.status(404).json({ error: "Item not found" });
        }

        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/:id", auth, async (req, res) => {
    // const data = await readData();
    // const itemId = parseInt(req.params.id, 10);
    // let removedItem = {};
    // const newData = data.filter(item => {
    //   if (item.id !== itemId) {
    //     return true;
    //   }
    //   removedItem = { ...item };
    //   return false;
    // });
    // if (data.length === newData.length) {
    //   return res.status(404).json({ error: "Item not found" });
    // }
    // await writeData(newData);
    // res.json(removedItem);

    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
        res.status(404).json({ error: "Item not found" });
    }
    res.json(deletedItem);
});

router.post("/upload", upload.single("file"), async (req, res, next) => {
    try {
        const { path: filePath } = req.file;
        const { isWithDelete = "true" } = req.query;

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName]
        const data = xlsx.utils.sheet_to_json(sheet);

        const { error } = itemsSchema.validate(data);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
    
        if (isWithDelete === "true") {
            await Item.deleteMany({});
        }
        await Item.insertMany(data);
        
        await fs.unlink(filePath); // Remove excel file from upload folder

        res.status(200).json({ message: "DB was succesfully updated!" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;