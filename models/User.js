const mongoose = require("mongoose");

const User = mongoose.model("User", {
    name: String,
    lastname: String,
    email: String,
    user: String,
    password: String,
});

module.exports = User;