import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { Response } from 'express';
import { User as IUser} from '../types/User';

dotenv.config();

if(process.env.SECRET === undefined) {
    throw new Error("Variável de ambiente SECRET não foi configurada.");
}

const SECRET = process.env.SECRET;

export const getUserByToken = async (res: Response, token: string) => {

    if(!token) {
        res.status(401).json({ message: "Access denied!" });
        return;
    }

    const decoded = jwt.verify(token, SECRET) as JwtPayload;

    const userId = decoded.id;

    const user = await User.findOne({ _id: userId });

    return user as IUser;
}
