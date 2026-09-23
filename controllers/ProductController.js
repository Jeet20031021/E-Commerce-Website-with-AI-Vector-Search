import { validationResult } from "express-validator";
import { User } from "../models/user.js";
import "dotenv/config";
import multer from "multer";
import { csrfSync } from "csrf-sync";
import { queue } from "../config/queue.js";
import { client } from "../config/elasticdb.js";
import { embedding } from "../services/embedding.js";
import { redis } from "../config/redis.js";


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


async function productSearch(req, res){
    const search = req.query?.search;
    try{
        const index_name = 'product';
        const cache_data = await redis.get(search);
        if(cache_data){
            const document = JSON.parse(cache_data);
            return res.json({
                'status': 'success',
                'data': document,
            });
        }

        const query_vector = await embedding(search);
        const products = await client.search({
            index: index_name,
            body:{
                knn: {
                    query_vector: query_vector,
                    field: 'description_vector',
                    k: 10,
                    num_candidates: 30,
                    boost: 0.4,
                },
                query: {
                    multi_match: {
                        query: search,
                        fields: ["product_name^2", "category", "description"],
                        boost: 0.6,
                    }
                }
            }
        });
        let document = [];
        products.hits.hits.map((product) => {
            document.push({
                'product_id': product._id,
                'name': product._source.product_name,
                'price': product._source.price,
                'url': product._source.product_image,
            });
        });

        await redis.setex(search, 60, JSON.stringify(document));
        return res.json({
            'status': 'success',
            'data': document,
        });
    }
    catch(err){
        return res.json({
            'status': 'failed',
            'message': err.message
        });
    }
}


export {
    addProductPage,
    csrfSynchronisedProtection,
    productSubmit,
    productSearch,
};