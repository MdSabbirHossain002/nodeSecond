const express = require("express");
const router = express.Router();

const {getSignup, signupController} = require('../controller/signupController');
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

//signup 
const page_title = 'Signup Page'
router.get('/signup', decorateHtmlResponse(page_title),getSignup)
router.post('/signup',signupController);
module.exports = router;