const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
var cookieParser = require('cookie-parser');

const router = express.Router();
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());

router.get('/signup',(req,res)=>{
  res.render('../views/signup/signup');
})
router.get('/login',(req,res)=>{
  res.render('../views/login/login');
})

//signup 
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
router.post('/signup', async (req,res)=>{
  const user = await User.find({ email: req.body.email });
  console.log(user);
  if (!user.length > 1) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
      });
      await newUser.save();
      res.redirect('/user/login');
  
      console.log('signup was successfull!!!');
      
    } catch {
        res.status(500).json({
            message: "Signup failed!",
        });
    }
  }
  
  

});

// LOGIN
router.post("/login", async(req, res) => {
  try {
      const user = await User.findOne({ email: req.body.email });
      //console.log(user);
      if(user) {
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (isValidPassword) {
            console.log('valided');
            const token = jwt.sign({'user':user.username}, process.env.JWT_SECRET);
            return res
              .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              })
              .status(200)
              .json({ message: "Logged in successfully 😊 👌" });
            
        } else {
            console.log('not valided or token problem');
            res.status(401).json({
              "error": 'Password not valided or token problem :(',
          });
        }
      }else{
          res.send('user length problem')
      }
      
  } catch {
      res.status(401).json({
          "error": 'first err',
      });
  }
});

router.get("/deleteall", async (req, res,next) => {
  res.send('all data deleted');

  User.deleteMany({},(err,resObj)=>{
  if (err) {
    console.log(err);
    next(err)
  } else {
    res.send(resObj);
  }});
});

module.exports = router;
