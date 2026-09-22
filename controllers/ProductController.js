import { validationResult } from "express-validator";
import { User } from "../models/user.js";
import "dotenv/config";
import multer from "multer";
import { csrfSync } from "csrf-sync";
import { queue } from "../config/queue.js";


const { invalidCsrfTokenError, generateToken, csrfSynchronisedProtection } = csrfSync();


async function addProductPage(req, res){
    const seller = await User.findOne({ email: req.user.email});
    return res.render('Seller/addProduct', { name: seller.name, token: generateToken(req) });
}

async function productSubmit(req, res){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.json({
                'status': 'failed',
                'message': errors.array()[0].msg,
            });
        }
        const seller = req.user.email;
        const { productName, price, quantity, inStock, description, category } = req.body;
        const stock = inStock === 'yes' ? true : false;
        const filepath = req.file.filename;
        await queue.add('add_product', {
            'productName': productName, 'seller': seller, price: price, 'description': description, 'stock': stock, 'category': category, 'image_url': filepath, 'quantity': quantity
        }, {
            removeOnComplete: true,
            attempts: 4,
            delay: 2000,
            backoff: {
                delay: 5000,
                type: 'exponential',
            }
        });
        return res.json({
            'status': 'success',
        });
    }
    catch(err){
        return  res.json({
            'status': 'failed',
            'message': err.message,
        });
    }
}


export {
    addProductPage,
    csrfSynchronisedProtection,
    productSubmit
};