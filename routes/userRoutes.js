const router = require("express").Router();

const User = require("../models/User");

//create
router.post("/", async (req, res) => {
    const { name, lastname, email, user, password } = req.body;

    if(!name){
        res.status(422).json({ error: "Name Required!"});
        return;
    }
    if(!lastname){
        res.status(422).json({ error: "Lastname Required!"});
        return;
    }
    if(!email){
        res.status(422).json({ error: "Email Required!"});
        return;    
    }
    if(!user){
        res.status(422).json({ error: "User Required!"});
        return;    
    }
    if(!password){
        res.status(422).json({ error: "Password Required!"});
        return;    
    }

    const objUser = {
        name,
        lastname,
        email,
        user,
        password,
    };

    try {
        await User.create(objUser);

        res.status(201).json({ message: "Registered user!"});
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//read

//findAll
router.get("/", async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//findOne
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findOne({ _id: id });

        if(!user){
            res.status(422).json({ message: "User Not Found!"});
            return;
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//update

//patch method to update only necessary data
router.patch("/:id", async (req, res) => {
    const id = req.params.id;

    const { name, lastname, email, user, password } = req.body;

    const objUser = {
        name, 
        lastname, 
        email, 
        user, 
        password,
    };

    try {
        const updateUser = await User.updateOne({ _id: id}, objUser);

        //matchedCount returns 1 if changes were made
        if(updateUser.matchedCount === 0){
            res.status(422).json({ message: "User Not Found!"});
            return;
        };

        res.status(200).json({ user: objUser });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//delete
router.delete("/:id", async(req, res) => {
    const id = req.params.id;

    const objUser = await User.findOne({ _id: id });

    if(!objUser){
        res.status(422).json({ message: "User Not Found!"});
        return;
    };

    try {
        await User.deleteOne({ _id: id });

        res.status(200).json({ message: "User Not Found!"});
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

module.exports = router;