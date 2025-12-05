import validator from "validator";

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