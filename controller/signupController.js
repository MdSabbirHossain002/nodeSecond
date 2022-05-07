const createError = require("http-errors");
const bcrypt = require("bcrypt");

// internal imports
const User = require("../models/User");

const signupController = async (req,res)=>{
    
  const userEmail = await User.find({ email: req.body.email });
  const userUsername = await User.find({ username: req.body.username });

  console.log(userEmail,userUsername);
  if (userEmail.length < 1 && userUsername.length < 1) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
      });
      console.log(newUser);
      await newUser.save();
      res.redirect('/user/login');

      console.log('signup was successfull!!!');
      
    } catch {
        res.status(500).json({
            message: "Signup failed!",
        });
    }
  }else{
    throw createError("this email or username already used.");
  }

}
function getSignup(req,res) {
  res.render('../views/signup/signup');

}
module.exports= {getSignup,signupController};