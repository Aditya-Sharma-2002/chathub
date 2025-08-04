const express = require('express');
const router = express.Router();
const { signUp,login,forgot,logout, resetPassword, otpLimiter } = require('../controller/auth');

router.post("/signup", signUp);
router.post("/login",login);
router.post("/forgot", otpLimiter ,forgot);
router.post("/resetPassword", resetPassword);
router.get("/logout",logout)

module.exports = router;