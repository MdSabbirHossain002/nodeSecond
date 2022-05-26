const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();
var cookieParser = require('cookie-parser');


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
