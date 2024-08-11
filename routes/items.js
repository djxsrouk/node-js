const express = require('express');
const { readData, writeData } = require("../services/dataService");
const router = express.Router();
const Joi = require('joi');

const itemsSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().max(255).optional(),
    price: Joi.number().positive().required()
})

router.get("/", async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error!"});
    }
});


router.post("/", async (req, res) => {
    try {
        const { error } = itemsSchema.validate(req.body);
        if (error) {
            res.status(400).json({error: error.details[0].message});
        }
        const data = await readData();
        const newItem = { id: data.length + 1, ...req.body };
        data.push(newItem);
        await writeData(data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({error: "Internal Server Error!"});
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { error } = itemsSchema.validate(req.body);
        if (error) {
            res.status(400).json({error: error.details[0].message});
        }
        const data = await readData();
        const itemId = parseInt(req.params.id, 10);
        const itemIndex = data.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            data[itemIndex] = { ...data[itemIndex], ...req.body };
            await writeData(data);
            res.json(data[itemIndex]);
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error!" });
    }
});


router.delete("/:id", async (req, res) => {
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

module.exports = router;