
// get login page
function getLogin(req, res, next) {
  res.render("login/login");
}

module.exports = {
    getLogin,
    // login,
    // logout,
  };