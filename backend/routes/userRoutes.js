const express = require('express');
const router = express.Router();
const { profile } = require('../controller/user');

router.post('/profile',profile);

module.exports = router;