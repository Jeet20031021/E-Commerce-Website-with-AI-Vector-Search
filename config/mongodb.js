import mongoose from "mongoose";
import "dotenv/config";


async function startDB(){
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Database is connected');
}

export { startDB };