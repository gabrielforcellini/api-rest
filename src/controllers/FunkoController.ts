import { Request, Response } from 'express';
import { getToken } from '../helpers/get-token';
import { getUserByToken } from '../helpers/get-user-by-token';
import { Funko } from '../models/Funko';

export class FunkoController {

    //create
    static async create(req: Request, res: Response) {
        const { title,
            description,
            price,
            imageUrl } = req.body;

        const sale = true;
    
        //validations
        if (!title) {
            return res.status(422).json({ message: "Title Required!" });
        };
        if (!description) {
            return res.status(422).json({ message: "Description Required!" });
        };
        if (!price) {
            return res.status(422).json({ message: "Price Required!" });
        };
        if (!imageUrl) {
            return res.status(422).json({ message: "Image Url Required!" });
        };
        if (sale === null) {
            return res.status(422).json({ message: "Sale Required!" });
        };

        //get funko owner
        const token = getToken(req);

        const user = await getUserByToken(res, token ?? '');
    
        //create a funko
        const funko = new Funko({
            title,
            description,
            price,
            imageUrl,
            sale,
            user: {
                _id: user?._id,
                name: user?.name,
                lastname: user?.lastname
            }
        });
    
        try {
            const newFunko = await funko.save();
    
            return res.status(201).json({ message: "Registered Funko!", newFunko });
        } catch (error) {
            return res.status(500).json({ message: error });
        };
    }

    static async findAll(res: Response) {
        try {
            const funkos = await Funko.find().sort('-createdAt');
    
            return res.status(200).json({ funkos });
        } catch (error) {
            return res.status(500).json({ message: error });
        };
    }

    static async update(req: Request, res: Response){
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

            return res.status(200).json({ funko });
        } catch (error) {
            return res.status(500).json({ message: error });
        };
    }

    static async findOne(req: Request, res: Response){
        const id = req.params.id;

        try {
            const funko = await Funko.findOne({ _id: id });

            if (!funko) {
                return res.status(422).json({ message: "Funko not Found!" });
            };

            return res.status(200).json({ funko });
        } catch (error) {
            return res.status(500).json({ message: error });
        };
    }


    static async delete(req: Request, res: Response) {
        const id = req.params.id;

        const funko = await Funko.findOne({ _id: id });

        if (!funko) {
            return res.status(422).json({ message: "Funko not Found!" });
        };

        try {
            await Funko.deleteOne({ _id: id });
            return res.status(200).json({ message: "Funko deleted!" });
        } catch (error) {
            return res.status(500).json({ message: error });
        };
    }
};