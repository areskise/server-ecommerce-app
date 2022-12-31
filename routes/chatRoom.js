const express = require('express');

const { verifyToken, verifyCounselor } = require('../middlewares/is-auth');
const controllers = require('../controllers/session');

const router = express.Router();

router.get('/chatrooms/getByUser', verifyToken, controllers.getRoomByUser);

router.get('/chatrooms/getById', verifyToken, controllers.getMessageByRoomId);

router.post('/chatrooms/createNewRoom', verifyToken, controllers.createNewRoom);

router.post('/chatrooms/endRoom', verifyToken, controllers.endRoom);

router.put('/chatrooms/addMessage', verifyToken, controllers.addMessage);

router.get('/chatrooms', verifyCounselor, controllers.getRoomChat);

module.exports = router;