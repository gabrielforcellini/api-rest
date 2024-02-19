import jwt from 'jsonwebtoken';
import { getToken } from './get-token';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';

dotenv.config();

if(process.env.SECRET === undefined) {
  throw new Error("Variável de ambiente SECRET não foi configurada.");
}

const SECRET = process.env.SECRET;

//middleware to validate token
export const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const token = getToken(req);

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Access denied!" });
  };

  if (!token) {
    return res.status(401).json({ error: "Access denied!" });
  };

  try {
    const verified = jwt.verify(token, SECRET);
    // @ts-ignore TODO: Verificar o que está acontecendo para não ter o user tipado no req
    req.user = verified;
    return next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid Token!" });
  }
}
