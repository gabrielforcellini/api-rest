const router = require("express").Router();

const userController = require("../controllers/UserController");

//create
router.post("/register", userController.register);

//User Login
router.post("/login", userController.login);

//Verify User
router.get("/checkuser", userController.checkUser);

//find By Id
router.get("/:id", userController.getUserById);

//findAll
router.get("/", userController.findAll);

//update By Id
router.patch("/:id", userController.updateOne);

//delete By Id
router.delete("/:id", userController.delete);

module.exports = router;