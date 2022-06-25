const router = require("express").Router();

const userController = require("../controllers/UserController");

//middleware
const verifyToken = require("../helpers/verify-token");

//create
router.post("/register", userController.register);

//User Login
router.post("/login", userController.login);

//Verify User
router.get("/checkuser", userController.checkUser);

//find By Id
router.get("/findOne/:id", userController.getUserById);

//findAll
router.get("/", userController.findAll);

//update By Id
router.patch("/edit/:id", verifyToken, userController.updateOne);

//delete By Id
router.delete("/delete/:id", verifyToken, userController.delete);

module.exports = router;