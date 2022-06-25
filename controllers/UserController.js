require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

//helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

const SECRET = process.env.SECRET;

module.exports = class userController {

    static async register(req, res) {
        const { name,
                lastname,
                email,
                password,
                confirmPassword } = req.body;
        
     if (!name) {
        return res.status(422).json({ error: "Name Required!" });
     };
     if (!lastname) {
        return res.status(422).json({ error: "Lastname Required!" });
     };
     if (!email) {
        return res.status(422).json({ error: "Email Required!" });
     };
     if (!password) {
        return res.status(422).json({ error: "Password Required!" });
     };
     if (!confirmPassword) {
        return res.status(422).json({ error: "Confirm Password Required!" });
     };
     if (confirmPassword !== password) {
        return res.status(422).json({ error: "Passwords don't match!" });
     };

     //check if user already exists
     const userExist = await User.findOne({ email: email });

     if (userExist) {
         return res.status(422).json({ error: "E-mail already registered! Please try another." });
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

        await createUserToken(newUser, req, res);
     } catch (error) {
         res.status(500).json({ error: error });
     };
    }

    static async login(req, res) {
      const { email, password } = req.body;

      if(!email) {
         return res.status(422).json({ error: "Email Required!" });
      };

      if(!password) {
         return res.status(422).json({ error: "Password Required!" });
      };

      //check if user already exists
      const user = await User.findOne({ email: email });

      if (!user) {
         return res.status(404).json({ error: "User does not exist!" });
      };

      //check if password match
      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
         return res.status(422).json({ error: "Invalid password!" });
      };

      try {
         await createUserToken(user, req, res)
      } catch (error) {
         res.status(500).json({ error });
      };
    }

    static async checkUser(req, res) {
      let currentUser;

      if(req.header.authorization){
         const token = getToken(req);
         const decoded = jwt.verify(token, SECRET);

         currentUser = await User.findById(decoded.id);
         currentUser.password = undefined;
      } else {
         currentUser = null;
      }

      res.status(200).send(currentUser);
    };

    static async getUserById(req, res) {
      const id = req.params.id;
      const user = await User.findById(id).select('-password');

      if(!user){
         return res.status(422).json({ message: "User Not Found!" });
      };

      res.status(200).json({ user });
    }

    static async findAll(req, res){
      try {
         const users = await User.find().select('-password');
 
         res.status(200).json({ users });
      } catch (error) {
         res.status(500).json({ error: error });
      };
    }

    static async updateOne(req, res){
      const id = req.params.id;

      const token = getToken(req);

      const user = await getUserByToken(token);

      const { name,
         lastname,
         email,
         password,
         confirmPassword } = req.body;
      
      if(!name){
         return res.status(422).json({ error: "Name Required!" });
      }

      user.name = name;
      
      if(!lastname){
         return res.status(422).json({ error: "Lastname Required!" });
      }

      user.lastname = lastname;
      
      if(!email){
         return res.status(422).json({ error: "E-mail Required!" });
      }

      const userExists = await User.findOne({ email: email });
      
      if(user.email !== email && userExists) {
         return res.status(422).json({ error: "E-mail already registered! Please try another!" })
      }

      user.email = email;
      
      if(!password){
         return res.status(422).json({ error: "Password Required!" });
      }
      
      if(!confirmPassword){
         return res.status(422).json({ error: "Confirm Password Required!" });
      }
      
      if(confirmPassword !== password){
         return res.status(422).json({ error: "Passwords does not match!" });
      }
      
      //create password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      user.password = passwordHash;

      try {
         await User.findOneAndUpdate({ _id: id }, { $set: user }, { new: true });

         res.status(200).json({ message: "User updated!" });
      } catch (error) {
         res.status(500).json({ error: error });
      };
    }

    static async delete(req, res){
      const id = req.params.id;

      const user = await User.findOne({ _id: id });

      if (!user) {
         return res.status(422).json({ message: "User Not Found!" });
      };

      try {
         await User.deleteOne({ _id: id });
         
         res.status(200).json({ message: "User deleted!" });
      } catch (error) {
         res.status(500).json({ error: error });
      };
    }
}