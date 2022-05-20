// external imports
const createError = require("http-errors");
// internal imports
const User = require("../models/User");

// get inbox page
async function getInbox(req, res, next) {
  try {
    
    const user = await User.find({
      $or: [
        // { "username": req.body.username },
        { "username": "" },

      ],
    });
    res.locals.partner = user;
    res.render("inbox/inbox");
  } catch (err) {
    next(err);
  }
}
//find user
async function searchUser(req, res, next) {
  const user = req.body.partner;
 

  try {
    if (user) {
      const users = await User.find(
        {username:user}
      );

      //res.json(users);
      res.locals.partner= users;
      res.render("inbox/inbox");
      
    } else {
      throw createError("You must provide some text to search!");
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

module.exports = {
    getInbox,
    searchUser,
}