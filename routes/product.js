const express = require('express');

const controllers = require('../controllers/product');

const router = express.Router();

router.get('/products', controllers.getAPI);

router.get('/products/pagination', controllers.getPagination);

router.get('/admin/products', controllers.adminProduct);

router.get('/products/category', controllers.getCategory);

router.get('/products/:id', controllers.getDetail);

module.exports = router;