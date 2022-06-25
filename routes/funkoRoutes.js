const router = require("express").Router();

const FunkoController = require("../controllers/FunkoController");

const verifyToken = require("../helpers/verify-token");

const Funko = require("../models/Funko");

//create
router.post("/create", verifyToken, FunkoController.create);

//read
//findAll
router.get("/", FunkoController.findAll);

//findOne
router.get("/:id", FunkoController.findOne);

//update
//patch method to update only necessary data
router.patch("/edit/:id", verifyToken, FunkoController.update);

//delete
router.delete("/delete/:id", verifyToken, FunkoController.delete);

module.exports = router;