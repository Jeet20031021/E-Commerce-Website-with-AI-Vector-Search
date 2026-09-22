import multer from "multer";
import { mult } from "../services/productImageRule.js";

function multer_middleware(req, res, next) {
    const upload = mult.single('productImage');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Catch Multer-specific errors (like file size)
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    status: 'Error',
                    message: 'File is Too large. Maximum size is 2MB.',
                });
            }
            return res.status(400).json({
                status: 'Error',
                message: `Upload error: ${err.message}`,
            });
        } else if (err) {
            // Catch custom errors thrown by the fileFilter
            return res.status(400).json({
                status: 'Error',
                message: err.message, // Will output "Image format is not Supported!"
            });
        }
        
        // Everything went fine, move to the next middleware
        next();
    });
}

export { multer_middleware as imageMulter };