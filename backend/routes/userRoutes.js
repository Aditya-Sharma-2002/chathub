const express = require('express');
const router = express.Router();
const { setProfile, getProfile } = require('../controller/user');
const multer = require('multer');
const upload = multer({ storage : multer.memoryStorage() });

router.post('/profile',upload.single('profile'),setProfile);
router.get('/getProfile', getProfile);

module.exports = router;