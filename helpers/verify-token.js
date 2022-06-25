require("dotenv").config();
const jwt = require("jsonwebtoken");
const getToken = require("./get-token");

const SECRET = process.env.SECRET;

//middleware to validate Token
const checkToken = (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).json({ error: "Access denied!" });
    }

    const token = getToken(req);

    if(!token){
        return res.status(401).json({ error: "Access denied!" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid Token!" });
    }
}

module.exports = checkToken;