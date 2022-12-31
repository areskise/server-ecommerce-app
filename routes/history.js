const express = require('express');

const { verifyToken, verifyAdmin } = require('../middlewares/is-auth');
const controllers = require('../controllers/order');

const router = express.Router();

router.get('/histories', verifyToken, controllers.getHistoryAPI);

router.get('/admin/histories', verifyAdmin, controllers.getAdminHistory);

router.get('/histories/:id', verifyToken, controllers.getDetail);

module.exports = router;