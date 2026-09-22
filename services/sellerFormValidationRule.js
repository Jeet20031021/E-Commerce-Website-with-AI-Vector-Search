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
    body('name').trim().escape().matches(/^[A-Za-z ]+$/).withMessage('Name only contain alphabets.'),
    body('email').trim().normalizeEmail().isEmail().withMessage('Please enter an valid email').custom(existEmail),
    body('phone').trim().escape().matches(/^\d{10}$/).withMessage('Phone must contain 10 digits'),
    body('password').trim().isStrongPassword().withMessage('Password is not strong'),
    body('pin').trim().matches(/^\d{6}$/).withMessage('pin only contains six digits'),
    body('state').trim().matches(/^[A-Za-z ]+$/).withMessage('please enter an valid state name'),
];

export { rule };