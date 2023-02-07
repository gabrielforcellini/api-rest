const router = require("express").Router();

const userController = require("../controllers/UserController");

//middleware
const verifyToken = require("../helpers/verify-token");

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
router.patch("/edit/:id", verifyToken, userController.editUser);

//findAll
router.get("/", userController.findAll);

res.status(200).json({ users });
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