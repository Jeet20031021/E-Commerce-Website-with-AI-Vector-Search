import express from "express";
import { client } from "./config/elasticdb.js";
import { startDB } from "./config/mongodb.js"
import { transporter } from "./config/mail.js";
import { createProductDB } from "./models/product.js";



const app = express();
app.set('view engine', 'ejs');
app.set('views', 'templates');
app.use(express.json());
app.use(express.urlencoded({extended: true}));


async function startServer(){
    try{
        await startDB();
        await client.info();
        console.log('Elastic db connected');
        transporter.verify();
        console.log('Mail serviced is on');
        await createProductDB();
        app.listen(process.env.PORT);
        console.log('Server is running on port '+ process.env.PORT);
    }
    catch(err){
        console.log(err.message);
    }
}

await startServer();