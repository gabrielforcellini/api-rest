const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const SECRET = process.env.SECRET;

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied!" });
    };

    try {

        jwt.verify(token, SECRET);

        next();
    } catch (error) {
        res.status(500).json({ error: "Invalid token!" });
    }
};

//create
router.post("/register", async (req, res) => {
    const { name,
        lastname,
        email,
        password,
        confirmPassword } = req.body;

    if (!name) {
        return res.status(422).json({ error: "Name Required!" });
    };
    if (!lastname) {
        return res.status(422).json({ error: "Lastname Required!" });
    };
    if (!email) {
        return res.status(422).json({ error: "Email Required!" });
    };
    if (!password) {
        return res.status(422).json({ error: "Password Required!" });
    };
    if (confirmPassword !== password) {
        return res.status(422).json({ error: "Passwords don't match!" });
    };

    //check if user already exists
    const userExist = await User.findOne({ email: email });

    if (userExist) {
        return res.status(422).json({ error: "E-mail already registered! Please try another." })
    };

    //create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //create a user
    const user = {
        name,
        lastname,
        email,
        password: passwordHash,
    };

    try {
        await User.create(user);

        res.status(201).json({ message: "Registered user!" });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//login
router.post("/login", async (req, res) => {
    const { email,
            password } = req.body;

    if (!email) {
        return res.status(422).json({ error: "Email Required!" });
    };
    if (!password) {
        return res.status(422).json({ error: "Password Required!" });
    };

    //check if user already exists
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ error: "User does not exist!" });
    };

    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(422).json({ error: "Invalid password!" });
    };

    try {
        const token = jwt.sign({ id: user._id }, SECRET);

        res.status(200).json({ message: "User authenticated successfully", token });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

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
router.get("/:id", checkToken, async (req, res) => {
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