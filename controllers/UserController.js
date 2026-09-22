import { User } from "../models/user.js";
import { validationResult } from "express-validator";
import { googleClient } from "../config/google.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { comparePassword } from "../config/hash.js";

async function submitForm(req, res){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                'status': 'failed',
                'message': errors.array()[0].msg
            });
        }
        const { name, email, password } = req.body;
        const user = new User({
            name: name,
            email: email,
            password: password,
        });
        await user.save();
        return res.json({
            'status': 'success',
        });
    }
    catch(err){
        return res.status(500).json({
            'status': 'error',
            'message': err.message,
        });
    }
}


async function oauthLogin(req, res){
    try{
        const { code } = req.query;
        const { tokens } = await googleClient.getToken(code);

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const user = await User.findOne({
            email: payload.email,
        });

        if(!user){
            await User.create({
                'name': payload.name,
                'email': payload.email,
                'googleId': payload.sub,
            });
        }
        else{
            user.googleId = payload.sub;
            user.save();
        }
        const jwtToken = jwt.sign({ email: payload.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('_token', jwtToken, {
            httpOnly: true,
            maxAge: 24 * 7 * 60 * 1000,
        });

         res.redirect("/user/dashboard");
    }
    catch(err){
        return res.json({
            'status': 'failed',
            'message': err.message
        });
    }
}

async function dashboardPage(req, res){
    return res.render('User/dashboard');
}

async function loginSubmit(req, res){
    try{
        const { email, password } = req.body;
        const user = await User.findOne({
            email: email,
        });
        if(!user){
            return res.json({
                'status': 'failed',
                'message': 'your account is found.',
            });
        }
        if(!comparePassword(password, user.password)){
            return res.json({
                'status': 'failed',
                'message': 'Incorrect Password.'
            });
        }
        const jwtToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie("_token", jwtToken, {
            httpOnly: true,
            maxAge: 24 * 7 * 60 * 1000
        });
        return res.json({
            'status': 'success',
        });
    }
    catch(error){
        return res.json({
            'status': 'failed',
            'message': error.message
        });
    }
}

async function logoutUser(req, res){
    try{
        res.clearCookie("_token",{
            httpOnly: true,
        });
        return res.redirect('/user/login');
    }
    catch(error){
        return res.json({
            'status': 'failed',

        });
    }
}


export { submitForm, oauthLogin, dashboardPage, logoutUser, loginSubmit };