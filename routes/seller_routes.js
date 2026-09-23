import express from "express";
import { loginPage, loginSubmit, singupPage, csrfSynchronisedProtection, formSubmit, logout, dashboardPage, showProductPage } from "../controllers/SellerController.js";
import { rule } from "../services/sellerFormValidationRule.js";
import { loginVerify } from "../middleware/sellerVerify.js";
import { addProductPage, productSubmit, csrfSynchronisedProtection as csrf } from "../controllers/ProductController.js";
import { imageMulter } from "../middleware/MulterMiddleware.js";
import { product_rule } from "../services/productValidationRule.js";


const router = express.Router();

router.get("/seller/login", loginPage);
router.get('/seller/signup', singupPage);
router.post('/seller/login/submit', loginSubmit);
router.post("/seller/signup/form/submit", csrfSynchronisedProtection, rule, formSubmit);
router.get("/seller/dashboard", loginVerify, dashboardPage);
router.get("/seller/logout", loginVerify, logout);
router.get("/seller/dashboard/addproduct", loginVerify, addProductPage);
router.post("/seller/dashboard/product/form/submit", loginVerify, csrf, imageMulter, product_rule, productSubmit);
router.get("/seller/dashboard/show/product", loginVerify, showProductPage);

export { router as seller_routes };