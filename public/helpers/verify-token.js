const jwt = require("jsonwebtoken");
const getToken = require("./get-token");
require("dotenv").config();

const SECRET = process.env.SECRET;

//middleware to validate token
const checkToken = (req, res, next) => {
  const token = getToken(req);

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Access denied!" });
  };

  if (!token) {
    return res.status(401).json({ error: "Access denied!" });
  };

  try {
    const verified = jwt.verify(token, SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token!" });
  }
}

module.exports = checkToken;