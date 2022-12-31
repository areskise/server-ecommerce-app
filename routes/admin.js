const express = require('express');

const controllers = require('../controllers/admin');
const { validateLogin } = require('../middlewares/validate');
const { verifyAdmin } = require('../middlewares/is-auth');
const { uploadFile } = require('../middlewares/uploadFile');

const router = express.Router();

router.post('/admin/login', validateLogin, controllers.adminLogin);

router.post('/admin/logout', controllers.adminLogout);

router.post('/admin/add', verifyAdmin, uploadFile, controllers.addProduct);

router.put('/admin/update', verifyAdmin, uploadFile, controllers.updateProduct);

router.delete('/admin/delete', verifyAdmin, controllers.deleteProduct);

module.exports = router;