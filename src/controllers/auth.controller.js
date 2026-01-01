import { validateSignupData, generateToken } from "../lib/utils.js"
import User from "../models/user.js"
import bcrypt from "bcrypt"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    try {
        validateSignupData(req);

        const { fullName, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email already exists"
            })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: passwordHash
        })

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                statusCode: 201,
                message: "User signed up successfully",
                data: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.fullName,
                    profilePic: newUser.profilePic,
                }
            });
        } else {
            res.status(400).json({
                statusCode: 400,
                message: "Invalid user data"
            })
        }

    } catch (err) {
        console.log("Error in signup controller : ", err)
        res.status(400).json({
            statusCode: 400,
            message: "Error while saving user",
            error: err.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                statusCode: 400,
                message: "Email and password is required"
            })
        }
        const user =await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid credentials"
            });
        };
        // note : never tells the client which one is incorrect: password or email
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid credentials"
            });
        }

        generateToken(user._id, res);

        res.status(200).json({
            statusCode: 200,
            message:"Loggedin successfully",
            data: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        })

    } catch (err) {
        console.log("Error in login controller", err);

        res.status(500).json({
            statusCode: 500, 
            message: "Internal server error"
        })
    }
}

export const logout = async (req, res) => {
    res.cookie("jwt", null, {maxAge: 0});

    res.status(200).json({
        statusCode: 200,
        message: "Logged out successfully"
    });
}

export const updateProfile = async(req, res) => {
    try{
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(400).json({
                statusCode: 400,
                message: "Profile pic is required"
            })
        }

        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}
        ).select("-password")

        res.status(200).json({
            statusCode: 200,
            message:"Profile pic updated successfully",
            data: updatedUser
        })
    }catch(err){
        console.log("Error in update profile pic", err);

        res.status(500).json({
            statusCode: 500,
            message: "Inernal server error",
            error: err.message
        })
    }
}