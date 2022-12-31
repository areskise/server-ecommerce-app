const express = require('express');

const controllers = require('../controllers/cart');
const { verifyToken } = require('../middlewares/is-auth');

const router = express.Router();

router.get('/carts', verifyToken, controllers.getCarts);

router.post('/carts/add', verifyToken, controllers.postAddToCart);

router.delete('/carts/delete', verifyToken, controllers.deleteToCart);

router.put('/carts/update', verifyToken, controllers.putToCart);

module.exports = router;