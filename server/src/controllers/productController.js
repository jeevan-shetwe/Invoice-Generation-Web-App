import { ProductService } from '../services/productService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts(req.user.id);
    sendSuccess(res, products, 200, 'Products retrieved successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body, req.user.id);
    sendSuccess(res, product, 201, 'Product created successfully');
  } catch (err) {
    sendError(res, err.message, 400);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body, req.user.id);
    sendSuccess(res, product, 200, 'Product updated successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Product not found' ? 404 : 400);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await ProductService.deleteProduct(req.params.id, req.user.id);
    sendSuccess(res, null, 200, 'Product deleted successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Product not found' ? 404 : 500);
  }
};
