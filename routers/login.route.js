const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const {doLoginValidators, doLoginValidationHandler} = require('../middlewares/login/loginvalidators')

const router = express.Router();
const User = require("../models/User");

// LOGIN

const page_title = 'Login Page'
router.get('/login',decorateHtmlResponse(page_title), getLogin);

router.post("/login",doLoginValidators,doLoginValidationHandler, async(req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      console.log("users with provided email:"+user);
      if(user) {
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (isValidPassword) {
            console.log('valided');
            const userObj = {
              userid: user._id,
              username: user.username,
              email:user.email,
            }
            const token = jwt.sign(userObj, process.env.JWT_SECRET,{
              expiresIn: process.env.JWT_EXPIRY,
            });
            console.log('token: '+token);
            return res.cookie(process.env.COOKIE_NAME, token, {
              maxAge: process.env.JWT_EXPIRY,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              signed: true,
            }).status(200).send('you are logged in');
            
        } else {
            console.log('not valided or token problem');
            res.status(401).json({
              "error": 'Password not valided or token problem :(',
          });
        }
      }else{
          res.send('User Not Found!!!')
      }
      
  } catch {
      res.status(401).json({
          "error": 'login catch error',
      });
  }
});

module.exports = router;
