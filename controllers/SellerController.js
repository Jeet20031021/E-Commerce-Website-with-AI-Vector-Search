import { comparePassword } from "../config/hash.js";
import { User } from "../models/user.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { csrfSync } from "csrf-sync";
import { validationResult } from "express-validator";

const { invalidCsrfTokenError, generateToken, csrfSynchronisedProtection } = csrfSync();


async function loginPage(req, res){
    return res.render('Seller/login');
}

async function singupPage(req, res){
    return res.render('Seller/signup', { token: generateToken(req) });
}

async function formSubmit(req, res){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                'status': 'failed',
                'message': errors.array()[0].msg,
            });
        }
        const { name, email, phone, password, street, pin, state, dist } = req.body;
        const obj = { 
            'state': state,
            'pin': pin,
            'district': dist,
            'street': street,
        };

        await User.create({
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: 'seller',
            address: obj,
        });

        return res.json({
            status: 'success',
        });
    }
    catch(err){
        return res.status(400).json({
            'status': 'failed',
            'message': err.message,
        });
    }
}

async function loginSubmit(req, res){
    try{
        const { email, password } = req.body;
        const seller = await User.findOne({
            email: email,
        });

        if(!seller && !seller.role === 'seller'){
            return res.json({
                'status': 'failed',
                'message': 'you are not a valid seller.',
            });
        }

        if(!comparePassword(password, seller.password)){
            return res.json({
                'status': 'failed',
                'message': 'Invalid password.',
            });
        }

        const jwtToken = jwt.sign({
            email: seller.email,
            role: seller.role,
            id: seller._id,
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie("_seller_token", jwtToken, {
            httpOnly: true,
            maxAge: 24 * 7 * 60 * 1000,
        });
        return  res.json({
            'status': 'success'
        });
        
    }
    catch(err){
        return res.json({
            'status': 'failed',
            'message': err.message,
        });
    }
}

async function dashboardPage(req, res){
    const seller = await User.findOne({ email: req.user.email});
    return res.render('Seller/dashboard', { name: seller.name });
}

async function showProductPage(req, res){
    const seller = await User.findOne({ email: req.user.email});
    return res.render('Seller/showProduct', { name: seller.name });
}

async function logout(req, res){
    try{
        res.clearCookie("_token",{
            httpOnly: true,
            maxAge: 7 * 60 * 24 * 1000,
        });
        return res.redirect('/seller/login');
    }
    catch(err){
        return res.json({
            'status': 'failed',
            'message': err.message
        });
    }
}




export { loginPage, loginSubmit, singupPage, csrfSynchronisedProtection, formSubmit, logout, dashboardPage, showProductPage };