import { Router } from 'express';
import { userController } from '../controllers/UserController';

const router = Router();

//middleware
const verifyToken = require("../helpers/verify-token");

//create
router.post("/register", userController.register);

//User Login
router.post("/login", userController.login);

//Verify User
router.get("/checkuser", userController.checkUser);

//read
//findOne
router.get("/:id", userController.getUserById);

//update

//patch method to update only necessary data
router.patch("/edit/:id", verifyToken, userController.updateOne);

//findAll
router.get("/", userController.findAll);

//delete
router.delete("/:id", verifyToken, userController.delete);

export default router;