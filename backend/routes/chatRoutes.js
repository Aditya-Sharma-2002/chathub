const express = require('express');
const router = express.Router();
const Message = require('../model/message');
const { fetchMessages, sendMessage, getChat } = require('../controller/chat');
// const Chat = require('../model/chat');

router.get('/messages/:chatId', fetchMessages);
router.post('/messages', sendMessage);
router.get('/chat/:userId/:friendId', getChat); 

module.exports = router;