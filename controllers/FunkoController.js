const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Funko = require("../models/Funko");

module.exports = class FunkoController {

    //create
    static async create(req, res) {
        const { title,
            description,
            price,
            imageUrl } = req.body;

        const sale = true;
    
        //validations
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
            return res.status(422).json({ error: "Image Url Required!" });
        };
        if (sale === null) {
            return res.status(422).json({ error: "Sale Required!" });
        };

        //get funko owner
        const token = getToken(req);

        const user = await getUserByToken(token);
    
        //create a funko
        const funko = new Funko({
            title,
            description,
            price,
            imageUrl,
            sale,
            user: {
                _id: user._id,
                name: user.name,
                lastname: user.lastname
            }
        });
    
        try {
            const newFunko = await funko.save();
    
            res.status(201).json({ message: "Registered Funko!", newFunko });
        } catch (error) {
            res.status(500).json({ error: error });
        };
    }

    static async findAll(req, res) {
        try {
            const funkos = await Funko.find().sort('-createdAt');
    
            res.status(200).json({ funkos });
        } catch (error) {
            res.status(500).json({ error: error });
        };
    }

    static async update(req, res){
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
                return res.status(422).json({ error: "Funko not Found!" });
            };

            res.status(200).json({ funko });
        } catch (error) {
            res.status(500).json({ error: error });
        };
    }

    static async findOne(req, res){
        const id = req.params.id;

        try {
            const funko = await Funko.findOne({ _id: id });

            if (!funko) {
                return res.status(422).json({ error: "Funko not Found!" });
            };

            res.status(200).json({ funko });
        } catch (error) {
            res.status(500).json({ error: error });
        };
    }


    static async delete(req, res) {
        const id = req.params.id;

        const funko = await Funko.findOne({ _id: id });

        if (!funko) {
            return res.status(422).json({ error: "Funko not Found!" });
        };

        res.status(200).json({ message: "Funko deleted!" });
        try {
            await Funko.deleteOne({ _id: id });
        } catch (error) {
            res.status(500).json({ error: error });
        };
    }
};