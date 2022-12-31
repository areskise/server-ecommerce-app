const express = require('express');

const { verifyToken, verifyCounselor } = require('../middlewares/is-auth');
const controllers = require('../controllers/session');

const router = express.Router();

router.get('/messenger', verifyToken, controllers.getMessage);

router.post('/messenger/send', verifyToken, controllers.postMessage);

router.post('/messenger/conversation', verifyToken, controllers.postConversation);

module.exports = router;