const express = require('express');
const router = express.Router();
const { signUp,login,forgot } = require('../controller/auth');

router.post("/signup", signUp);
router.post("/login",login);
router.get("/forgot",forgot);

module.exports = router;


