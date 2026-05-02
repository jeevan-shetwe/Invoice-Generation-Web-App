import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { validate } from '../middleware/validate.js';
import { productSchema } from '../validations/product.validation.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', validate(productSchema), createProduct);
router.put('/:id', validate(productSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
