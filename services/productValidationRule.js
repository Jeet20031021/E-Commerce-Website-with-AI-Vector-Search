import { body } from "express-validator";


const rule = [
    body('name').trim().escape(),
    body('price').trim().escape().isNumeric().withMessage('Price must be valid number'),
    body('quantity').trim().isInt().withMessage('Quantity must a Whole Number'),
];

export { rule as product_rule };