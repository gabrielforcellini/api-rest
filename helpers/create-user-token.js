require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET;

const createUserToken = async (user, req, res) => {
    //create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, SECRET);

    //return a token
    res.status(200).json({ message: "User authenticated!", token: token });

};

module.exports = createUserToken;