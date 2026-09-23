import express from "express";
import { client } from "./config/elasticdb.js";
import { startDB } from "./config/mongodb.js"
import { transporter } from "./config/mail.js";
import { createProductDB } from "./models/product.js";
import { simple_router } from "./routes/simple_routes.js";
import "dotenv/config";
import MongoStore from "connect-mongo";
import session from "express-session";
import { seeding } from "./seeders/adminSeeder.js";
import cookieParser from "cookie-parser";
import { seller_routes } from "./routes/seller_routes.js";
import fs from "node:fs";
import path from "node:path";


const app = express();
const folder = path.join(import.meta.dirname, "uploads");
app.use('/uploads', express.static(path.join(import.meta.dirname, 'uploads')))
app.set('view engine', 'ejs');
app.set('views', 'templates');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL,
        collectionName: 'sessions',
        ttl: 7 * 24 * 60 * 1000,         // 7 Days
        autoRemove: 'native'
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 1000, // 7 Days
        httpOnly: true,
        secure: false
    }
}));
app.use(cookieParser());

async function startServer(){
    try{
        await startDB();
        await client.info();
        console.log('Elastic db connected');
        transporter.verify();
        console.log('Mail serviced is on');
        await createProductDB();
        // await seeding();  // This is for one time seeding 
        if(!fs.existsSync(folder)){
            fs.mkdirSync('uploads');
        }
        app.listen(process.env.PORT);
        console.log('Server is running on port '+ process.env.PORT);
    }
    catch(err){
        console.log(err.message);
    }
}

await startServer();

// Routes
app.use("/", simple_router);
app.use("/", seller_routes);