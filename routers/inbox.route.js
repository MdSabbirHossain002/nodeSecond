const express = require("express");
const router = express.Router();
const {getInbox, searchUser} = require('../controller/inboxController');
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
// internal imports
const User = require("../models/User");

//signup 
const page_title = 'Inbox Page'
router.get('/inbox', decorateHtmlResponse(page_title),getInbox)
router.post('/inbox', searchUser);
module.exports = router;

//  //console.log(req.body.partner);
//     //res.redirect('/inbox')
//     try {
//       var partners = [];
//       var {a,b} =partners;
  
//       const partner = await User.find({
//         $or: [
//           { "username": req.body.partner },
  
//         ],
//       }).select('username');
//       //var {id,men} = partner;
//       partners.push(partner);
//       res.locals.partner = partners;
//       console.log("a: " +a);
//       res.render("inbox/inbox");
//     } catch (err) {
//       next(err);
//     }