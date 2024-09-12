const { getUser } = require("../services/auth");
const { errorHandler } = require("../error");

async function checkAuthentication(req, res, next) {
  const uid = req.cookies.uid;
  if (!uid) {
    const aid = req.cookies?.aid;
    if (!aid) {
      return next(new errorHandler("First Login to the website", 400));
    }
    const admin = getUser(aid);
    req.user = admin;
  } else {
    const user = getUser(uid);
    req.user = user;
  }
  return next();
}

module.exports = {
  checkAuthentication,
};
