import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User } from '../types/User';
import { Response } from 'express';

dotenv.config();

if (process.env.SECRET === undefined) {
    throw new Error("Variável de ambiente SECRET não foi configurada.");    
}

const SECRET = process.env.SECRET;

export const createUserToken = async (user: User, res: Response) => {
    //create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, SECRET);

    //return a token
    res.status(200).json({ message: "User authenticated!", token: token });
};
