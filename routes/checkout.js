const express = require('express');

const { verifyToken } = require('../middlewares/is-auth');
const controllers = require('../controllers/order');

const router = express.Router();

router.post('/order', verifyToken, controllers.postOrder);

module.exports = router;