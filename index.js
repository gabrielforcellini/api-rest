// config inicial
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

//way to read json
//middleware
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());

//api routes
const userRoutes = require("./routes/userRoutes");
const funkoRoutes = require("./routes/funkoRoutes");

//user api routes
app.use("/user", userRoutes);

//funkos api routes
app.use("/funko", funkoRoutes);

//initial route
app.get("/", (req, res) => {
    res.json({ message: "API criada para projeto final em react - Arthur Elias, Gabriel Forcellini e Matheus Schmidt" })
})

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

mongoose
    .connect(
        `mongodb+srv://${DB_USER}:${DB_PASSWORD}@api-rest.h9mcxap.mongodb.net/api-rest?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(4000);
        console.log("Conectado ao mongoDB");
    })
    .catch((e) => console.log(e));