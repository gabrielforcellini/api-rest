// config inicial
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

//way to read json
//middleware
app.use(
    express.urlencoded({ extended: true })
);

app.use(express.json());

//solve cors
app.use(cors());

//public folder for images
app.use(express.static("public"));

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
});

app.listen(4000);