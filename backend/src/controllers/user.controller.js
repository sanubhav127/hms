import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req , res) =>{
    
    const {fullname, email, password, role} = req.body;
   try {
       if(!fullname || !password || !email || !role){
        return res.status(400).json({message : "All fields are mandatory!"})
       }; 

       const user = await User.findOne({email});
       if(user){
        return res.status(409).json({message : "Person already exists"});
       };

       const genSalt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(password, genSalt);

       const newUser = new User({
        fullname,        
        email,
        password : hashPassword,
        role
       });

       await newUser.save();

       const token = jwt.sign({_id : newUser._id, email : newUser.email}, process.env.JWT_SECRET, {expiresIn : "7d"});

       res.cookie("token" , token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "strict",
        maxAge : 7*24*60*60*1000
       });

       res.status(201).json({message : "User registered successfully!", user : { _id : newUser._id, fullname : newUser.fullname, email : newUser.email, role : newUser.role }});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {

    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}).select("+password")
        if(!user){
            return res.status(401).json({message : "Invalid email or password"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message : "Invalid email or password"});
        }

        const token = jwt.sign({_id : user._id, email : user.email}, process.env.JWT_SECRET, {expiresIn : "7d"});

        res.cookie("token" , token, {
        httpOnly: true,
        secure: false, // set true in production with HTTPS
        sameSite: "strict",
        maxAge : 7*24*60*60*1000
       });

       res.json({ message: "Login successful!", user : { _id : user._id, fullname : user.fullname, email : user.email, role : user.role } });
    } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server error" });   
    }
};

export const getProfile = (req,res) => {
    res.status(200).json({user : req.user});
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("fullname email role");
    res.status(200).json({ doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure : false,
            sameSite : "strict",
            maxAge : 0
        });

        res.json({message : "Logged Out successfully!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};