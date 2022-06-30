const mongoose = require("mongoose");
require("dotenv").config();

async function main() {    
    await mongoose
        .connect(
            `mongodb://localhost:27017/api-rest`
        )
        console.log("Conectado ao mongoDB");
};

main().catch((err) => console.log(err));

module.exports = mongoose;