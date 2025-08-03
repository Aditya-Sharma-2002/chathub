const express = require('express');
const router = express.Router();
const { signUp,login,forgot,logout } = require('../controller/auth');

router.post("/signup", signUp);
router.post("/login",login);
router.post("/forgot",forgot);
router.get("/logout",logout)

module.exports = router;