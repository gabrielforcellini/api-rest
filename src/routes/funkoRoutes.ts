import { Router } from 'express';
import { FunkoController } from '../controllers/FunkoController';
import { checkToken } from '../helpers/verify-token'

const router = Router();

//create
router.post("/create", checkToken, FunkoController.create);

//findAll
router.get("/", FunkoController.findAll);

//findOne
router.get("/:id", FunkoController.findOne);

//update
router.patch("/edit/:id", checkToken, FunkoController.update);

//delete
router.delete("/delete/:id", checkToken, FunkoController.delete);

export default router;