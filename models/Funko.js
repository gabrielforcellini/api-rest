const mongoose = require("mongoose");

const Funko = mongoose.model("Funko", {
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    sale: Boolean,
});

module.exports = Funko;