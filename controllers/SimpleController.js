import { csrfSync } from "csrf-sync";

const { generateToken, invalidCsrfTokenError, csrfSynchronisedProtection } = csrfSync();


async function homePage(req, res){
    try{
        return res.render('home');
    }
    catch(err){
        return  res.json({
            'error': err.message,
        });
    }
}

async function signUpPage(req, res){
    try{
        return res.render('signup', { token: generateToken(req) });
    }
    catch(err){
        return res.json({
            'error': err.message,
        });
    }
}

async function userLoginPage(req, res){
    return res.render("User/login");
}

export { homePage, signUpPage, userLoginPage, csrfSynchronisedProtection };