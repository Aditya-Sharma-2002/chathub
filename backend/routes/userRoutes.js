const express = require('express');
const router = express.Router();
const { setProfile, getProfile, searchUsers, setNames, getFriends } = require('../controller/user');
const multer = require('multer');
const upload = multer({ storage : multer.memoryStorage() });

router.post('/profile', upload.single('profile'), setProfile);
router.get('/getProfile', getProfile);
router.get('/searchUsers', searchUsers);
router.put('/setNames', setNames);
router.get('/friends', getFriends);

module.exports = router;