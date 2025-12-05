import validator from "validator";
import jwt from "jsonwebtoken";


export const validateSignupData = (req) => {
    const{fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        throw new Error("All fields are required!");
    }

    if(fullName.length < 3 || fullName.length > 30){
        throw new Error ("Fullname should be 3 - 30 characters")
    }

    if(!validator.isEmail(email)){
        throw new Error ("invalid email address");
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }
}




export const generateToken = (userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //mili second
        httpOnly: true, //prevent xss attacks: cross-site scripting
        sameSite: "strict", //CSRF attacks
        secure: process.env.NODE_ENV === "development" ? false : true,
    })
}