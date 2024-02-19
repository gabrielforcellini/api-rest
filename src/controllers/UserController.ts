import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { User as IUser} from '../types/User';

dotenv.config();

if(process.env.SECRET === undefined) {
   throw new Error("Variável de ambiente SECRET não foi configurada.");
}

//helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const SECRET = process.env.SECRET;

export class userController {

   static async register(req: Request, res: Response) {
      const { name,
         lastname,
         email,
         password,
         confirmPassword } = req.body;

      if (!name) {
         return res.status(422).json({ message: "Name Required!" });
      };
      if (!lastname) {
         return res.status(422).json({ message: "Lastname Required!" });
      };
      if (!email) {
         return res.status(422).json({ message: "Email Required!" });
      };
      if (!password) {
         return res.status(422).json({ message: "Password Required!" });
      };
      if (!confirmPassword) {
         return res.status(422).json({ message: "Confirm Password Required!" });
      };
      if (confirmPassword !== password) {
         return res.status(422).json({ message: "Passwords don't match!" });
      };

      //check if user already exists
      const userExist = await User.findOne({ email: email });

      if (userExist) {
         return res.status(422).json({ message: "E-mail already registered! Please try another." });
      };

      //create password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      //create a user
      const user = new User({
         name,
         lastname,
         email,
         password: passwordHash,
      });

      try {
         const newUser = await user.save();

         return await createUserToken(newUser, req, res);
      } catch (error) {
         return res.status(500).json({ message: error });
      };
   }

   static async login(req: Request, res: Response) {
      const { email, password } = req.body;

      if (!email) {
         return res.status(422).json({ message: "Email Required!" });
      };

      if (!password) {
         return res.status(422).json({ message: "Password Required!" });
      };

      //check if user already exists
      const user = await User.findOne({ email: email });

      if (!user) {
         return res.status(404).json({ message: "User does not exist!" });
      };

      //check if password match
      const checkPassword = await bcrypt.compare(password, user.password ?? '');

      if (!checkPassword) {
         return res.status(422).json({ message: "Invalid password!" });
      };

      try {
         return await createUserToken(user, req, res);
      } catch (error) {
         return res.status(500).json({ message: error });
      };
   }

   static async checkUser(req: Request, res: Response) {
      let currentUser;

      // @ts-ignore TODO: Verificar porque authorization não está na tipagem do req
      if (req.header.authorization) {
         const token = getToken(req);
         const decoded = jwt.verify(token, SECRET) as JwtPayload;

         currentUser = await User.findById(decoded.id) as IUser;
         currentUser.password = undefined;
      } else {
         currentUser = null;
      }

      res.status(200).send(currentUser);
   };

   static async getUserById(req: Request, res: Response) {
      const id = req.params.id;
      const user = await User.findById(id).select('-password');

      if (!user) {
         return res.status(422).json({ message: "User Not Found!" });
      };

      return res.status(200).json({ user });
   }

   static async findAll(res: Response) {
      try {
         const users = await User.find().select('-password');

         res.status(200).json({ users });
      } catch (error) {
         res.status(500).json({ message: error });
      };
   }

   static async updateOne(req: Request, res: Response) {
      const id = req.params.id;

      const token = getToken(req);

      const user = await getUserByToken(token);

      const { name,
         lastname,
         email,
         password,
         confirmPassword } = req.body;

      if (!name) {
         return res.status(422).json({ message: "Name Required!" });
      }

      user.name = name;

      if (!lastname) {
         return res.status(422).json({ message: "Lastname Required!" });
      }

      user.lastname = lastname;

      if (!email) {
         return res.status(422).json({ message: "E-mail Required!" });
      }

      const userExists = await User.findOne({ email: email });

      if (user.email !== email && userExists) {
         return res.status(422).json({ message: "E-mail already registered! Please try another!" });
      }

      user.email = email;

      if (!password) {
         return res.status(422).json({ message: "Password Required!" });
      }

      if (!confirmPassword) {
         return res.status(422).json({ message: "Confirm Password Required!" });
      }

      if (confirmPassword !== password) {
         return res.status(422).json({ message: "Passwords does not match!" });
      }

      //create password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;

      try {
         await User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

         return res.status(200).json({ message: "User updated!" });
      } catch (error) {
         return res.status(500).json({ message: error });
      };
   }

   static async delete(req: Request, res: Response) {
      const id = req.params.id;

      const user = await User.findOne({ _id: id });

      if (!user) {
         return res.status(422).json({ message: "User Not Found!" });
      };

      try {
         await User.deleteOne({ _id: id });

         return res.status(200).json({ message: "User deleted!" });
      } catch (error) {
         return res.status(500).json({ error: error });
      };
   }
}