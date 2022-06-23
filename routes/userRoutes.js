const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const userController = require("../controllers/UserController");

const SECRET = process.env.SECRET;

//create

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/checkuser", userController.checkUser);

router.get("/:id", userController.getUserById);

//read

//findAll
router.get("/", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//findOne
//private route
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id, '-password');

        if (!user) {
            return res.status(422).json({ message: "User Not Found!" });
        };

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//update

//patch method to update only necessary data
router.patch("/:id", async (req, res) => {
    const id = req.params.id;

    const { name,
        lastname,
        email,
        password } = req.body;

    const objUser = {
        name,
        lastname,
        email,
        password,
    };

    try {
        const updateUser = await User.updateOne({ _id: id }, objUser);

        //matchedCount returns 1 if changes were made
        if (updateUser.matchedCount === 0) {
            return res.status(422).json({ message: "User Not Found!" });
        };

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//delete
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ _id: id });

    if (!user) {
        return res.status(422).json({ message: "User Not Found!" });
    };

    res.status(200).json({ message: "User deleted!" });
    try {
        await User.deleteOne({ _id: id });

        res.status(200).json({ message: "User Not Found!" });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

module.exports = router;