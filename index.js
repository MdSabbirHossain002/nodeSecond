let PORT =process.env.PORT || 3333
let app = require('./app')
//default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(500).json({ error: err });
  }
  
 // app.use(errorHandler);
app.listen((PORT), () => {
    console.log(`server is running at port http://localhost:${PORT}`);
});