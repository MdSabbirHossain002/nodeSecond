let express = require("express")
let app = express()
let usersRouter = require('./routers/user.route')
let mongoose = require('mongoose')
// database connection with mongoose
mongoose
  .connect("mongodb+srv://sabbir002:sabbir002dbpass@cluster0.o5rkc.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection successful"))
  .catch((err) => console.log(err));
app.set('view engine', 'ejs');
app.use("/user", usersRouter);
// //app.use("/", mongodbRouter);
// app.use('/todo',todos)

//default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err });
  }
  
  app.use(errorHandler);

module.exports = app;