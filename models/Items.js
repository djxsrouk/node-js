const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    description: {
        type: String,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

const Item = mongoose.model("Item", itemsSchema);
module.exports = Item;