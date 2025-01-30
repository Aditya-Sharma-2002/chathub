const express = require('express');
const router = express.Router();
const { setProfile, getProfile, searchUsers, setNames } = require('../controller/user');
const multer = require('multer');
const upload = multer({ storage : multer.memoryStorage() });

router.post('/profile', upload.single('profile'), setProfile);
router.get('/getProfile', getProfile);
router.get('/searchUsers', searchUsers);
router.put('/setNames', setNames);

module.exports = router;