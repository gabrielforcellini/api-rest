// config inicial
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

//forma de ler o JSON
//middleware
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());

//rotas api
const userRoutes = require("./routes/userRoutes");

app.use("/user", userRoutes);

//rota inicial
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
        app.listen(3000);
    })
    .catch((e) => console.log(e));