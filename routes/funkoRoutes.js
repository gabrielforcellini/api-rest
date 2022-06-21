const router = require("express").Router();

const Funko = require("../models/Funko");

//create
router.post("/", async (req, res) => {
    const { title,
        description,
        price,
        imageUrl,
        sale } = req.body;

    if (!title) {
        return res.status(422).json({ error: "Title Required!" });
    };
    if (!description) {
        return res.status(422).json({ error: "Description Required!" });
    };
    if (!price) {
        return res.status(422).json({ error: "Price Required!" });
    };
    if (!imageUrl) {
        return res.status(422).json({ error: "ImageUrl Required!" });
    };
    if (sale === null) {
        return res.status(422).json({ error: "Sale Required!" });
    };

    const funko = {
        title,
        description,
        price,
        imageUrl,
        sale,
    };

    try {
        await Funko.create(funko);

        res.status(201).json({ message: "Registered Funko!" });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//read

//findAll
router.get("/", async (req, res) => {
    try {
        const funkos = await Funko.find();

        res.status(200).json({ funkos });
    } catch (error) {
        res.status(500).json({ error: error });
    };
});

//findOne
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const funko = await Funko.findOne({ _id: id });

        if (!funko) {
            return res.status(422).json({ message: "Funko not Found!" });
        };

        res.status(200).json({ funko });
    } catch (error) {
        res.status(500).json({ error: error });
    };
})

//update

//patch method to update only necessary data
router.patch("/:id", async (req, res) => {
    const id = req.params.id;

    const {
        title,
        description,
        price,
        imageUrl,
        sale,
    } = req.body;

    const funko = {
        title,
        description,
        price,
        imageUrl,
        sale,
    };

    try {
        const updateFunko = await Funko.updateOne({ _id: id }, funko);

        //matchedCount returns 1 if changes were made
        if (updateFunko.matchedCount === 0) {
            return res.status(422).json({ message: "Funko not Found!" });
        };

        res.status(200).json({ funko });
    } catch (error) {
        res.status(500).json({ error: error });
    };
})


//delete
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    const funko = await Funko.findOne({ _id: id });

    if (!funko) {
        return res.status(422).json({ message: "Funko not Found!" });
    };

    res.status(200).json({ message: "Funko deleted!" });
    try {
        await Funko.deleteOne({ _id: id });
    } catch (error) {
        res.status(500).json({ error: error });
    };
})

module.exports = router;