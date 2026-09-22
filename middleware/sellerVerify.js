import jwt from "jsonwebtoken";
import "dotenv/config";

async function loginVerify(req, res, next){
    const token = req.cookies?._seller_token;
    try{
        if(!token) return res.redirect('/user/login');
        const decodeUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodeUser;
        next();
    }
    catch(err){
        res.clearCookie("_token", {
            httpOnly: true,
        });
        return  res.redirect('/user/login');
    }
    
}

export { loginVerify };