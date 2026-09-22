import { body } from "express-validator";
import { User } from "../models/user.js";

async function existEmail(email){
    const user = await User.findOne({
        email: email,
    });
    if(!user){
        return true;
    }
    throw new Error("Email id already registered");
}

const rule = [
    body('name').trim().escape().matches(/^[A-Za-z ]+$/).withMessage("Name only contains alphabets"),
    body('email').trim().isEmail().withMessage('Please enter valid email id').normalizeEmail().custom(existEmail).withMessage("Email id already registered"),
    body('password').trim().isStrongPassword().withMessage("Please enter a Strong password"),
];

export { rule };