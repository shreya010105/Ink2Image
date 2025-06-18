const express = require('express');
const {registerUser,LoginUser, userCredits, paymentRazorpay, verifyRazorpay} = require('../controllers/userController');
const { userAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/register',registerUser)
router.post('/login',LoginUser)
router.get('/credits',userAuth,userCredits)
router.post('/pay',userAuth,paymentRazorpay)
router.post('/verify',userAuth,verifyRazorpay)


module.exports = router;