import { User } from "../models/user.js";
import path from "node:path";
import fs from "node:fs/promises";

async function seeding(){
    const folder = path.join("seeders", "JSON", "admin.json");
    try{
        const data = await fs.readFile(folder, 'utf-8');
        const json_parsed = JSON.parse(data);

        await User.insertMany(json_parsed);
        console.log('Data sedding is done!');
    }
    catch(err){
        console.log('Sorry data seeding is failed due to: '+ err.message);
    }
}

export { seeding };