import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const folder = path.join("uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder);
    },
    filename: async (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = path.basename(file.originalname, ext) + "_" + Date.now() + ext;
        cb(null, filename);
    }
});

const fileFilter = async (req, file, cb) => {
    const mimes = ["image/jpg", "image/jpeg", "image/avif", "image/webp", "image/png", "image/jfif"];
    if(mimes.includes(file.mimetype)){
        cb(null, true);
    }
    else{
        cb(new Error("This type of file is not supported!"), null);
    }
};

const mult = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fieldSize: 2 * 1024 * 1024,
    }
});


export { mult };