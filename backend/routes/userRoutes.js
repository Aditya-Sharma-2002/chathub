const express = require('express');
const router = express.Router();
const { setProfile, getProfile, searchUsers } = require('../controller/user');
const multer = require('multer');
const upload = multer({ storage : multer.memoryStorage() });

router.post('/profile', upload.single('profile'), setProfile);
router.get('/getProfile', getProfile);
router.get('/searchUsers', searchUsers);

module.exports = router;