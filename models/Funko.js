const mongoose = require("mongoose");
const { Schema } = mongoose;

const Funko = mongoose.model("Funko",
    new Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        sale: {
            type: Boolean,
            required: true
        },
        user: Object,
    },{ timestamps: true },)
);

module.exports = Funko;