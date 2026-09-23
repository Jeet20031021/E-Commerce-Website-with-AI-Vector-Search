// All Basic Routes are here
import express from "express";
import { csrfSynchronisedProtection, homePage, signUpPage, userLoginPage } from "../controllers/SimpleController.js";
import { dashboardPage, loginSubmit, logoutUser, oauthLogin, submitForm } from "../controllers/UserController.js";
import { rule } from "../services/userFormValidationRule.js";
import { googleClient } from "../config/google.js";
import { loginVerify } from "../middleware/loginVerify.js";
import { productSearch } from "../controllers/ProductController.js";

const router = express.Router();


router.get("/", homePage);
router.get("/SignUp", signUpPage);
router.post("/user/form/submit", csrfSynchronisedProtection, rule, submitForm);
router.get("/user/login", userLoginPage);
router.get("/auth/google", async (req, res) => {
    const url = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: ["profile", "email"],
    });

    return res.redirect(url);
});
router.get("/auth/google/callback", oauthLogin);
router.get("/user/dashboard", loginVerify, dashboardPage);
router.post("/user/login/submit", loginSubmit);
router.get("/user/logout", loginVerify, logoutUser);
router.get("/search", productSearch);



export { router as simple_router };