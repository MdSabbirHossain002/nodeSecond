const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
var cookieParser = require('cookie-parser');

// internal imports
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse')
const {doLoginValidators, doLoginValidationHandler} = require('../middlewares/login/loginvalidators')
const router = express.Router();
const User = require("../models/User");

// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());
router.use(cookieParser('cookie secret'));

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return res.sendStatus(403);
    console.log('there are no jwt');
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = data.user;
    console.log(data, data.user);
    return next();

  } catch {
    return res.sendStatus(403);
    console.log('jwt authentication erroe');
  }
};

router.get("/protected", authorization, (req, res) => {
  return res.json({ user: { 'id': req.userId } });
});


// LOGIN

const page_title = 'Login Page'
router.get('/login',decorateHtmlResponse(page_title), getLogin);
// router.get('/test',decorateHtmlResponse('test'), (req,res)=>{
//   res.cookie(process.env.COOKIE_NAME, "i am cookie",{
//     maxAge: process.env.JWT_EXPIRY,
//     //httpOnly: true,
//     //secure: process.env.NODE_ENV === "production",
//     signed: true,
//   },"password").status(200).json({ message: "cookie is inserted " });
// });

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

router.get("/deleteall", async (req, res,next) => {

  User.deleteMany({},(err,resObj)=>{
  if (err) {
    console.log(err);
    next(err)
  } else {
    res.send(resObj);
  res.send('all data deleted');

  }});
});
router.get("/findall", async (req, res,next) => {
  const filter = {};
  const all = await User.find(filter);
  res.send(all);
});

module.exports = router;
