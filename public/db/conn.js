const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
    const DB_USER = process.env.DB_USER;
    const DB_PASSWORD = process.env.DB_PASSWORD;

    await mongoose
        .connect(
            `mongodb+srv://${DB_USER}:${DB_PASSWORD}@api-rest.h9mcxap.mongodb.net/?retryWrites=true&w=majority`
        )
    console.log("Conectado ao mongoDB");
};

main().catch((err) => console.log(err));

module.exports = mongoose;