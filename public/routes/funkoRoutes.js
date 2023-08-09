const router = require("express").Router();

const FunkoController = require("../controllers/FunkoController");

const verifyToken = require("../helpers/verify-token");

//create
router.post("/create", verifyToken, FunkoController.create);

//findAll
router.get("/", FunkoController.findAll);

//findOne
router.get("/:id", FunkoController.findOne);

//update
router.patch("/edit/:id", verifyToken, FunkoController.update);

//delete
router.delete("/delete/:id", verifyToken, FunkoController.delete);

module.exports = router;