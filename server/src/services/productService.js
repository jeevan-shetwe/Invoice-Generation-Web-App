import { Product } from '../models/index.js';

export const ProductService = {
  getAllProducts: async (userId) => {
    return await Product.findAll({ where: { userId } });
  },

  createProduct: async (data, userId) => {
    return await Product.create({ ...data, userId });
  },

  updateProduct: async (id, data, userId) => {
    const product = await Product.findOne({ where: { id, userId } });
    if (!product) throw new Error('Product not found');
    return await product.update(data);
  },

  deleteProduct: async (id, userId) => {
    const product = await Product.findOne({ where: { id, userId } });
    if (!product) throw new Error('Product not found');
    await product.destroy();
    return true;
  }
};
