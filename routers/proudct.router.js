const express = require('express')
const router = express.Router();
const productController = require('../controllers/product.controller.js');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product.controller.js');

//gets
router.get('/', getProducts);
router.get("/:id", getProduct);

//posts
router.post('/', createProduct);

//Updates
router.put('/:id', updateProduct);

//delete
router.delete('/:id', deleteProduct);

module.exports = router;