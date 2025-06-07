const express = require('express');
const router = express.Router();
const auth = require('../controllers/user.controllers');

router.post('/send-otp', auth.sendOtp);
router.post('/verify-otp', auth.verifyOtp);
router.post('/save-details', auth.saveDetails);
router.get("/getuser", auth.getUser);

module.exports = router;
