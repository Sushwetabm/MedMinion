const { getPatient } = require("../services/auth");
const { errorHandler } = require("../error");

async function checkAuthentication(req, res, next) {
  const pid = req.cookies.pid;
  if (!pid) {
    const aid = req.cookies?.aid;
    if (!aid) {
      return next(new errorHandler("First Login to the website", 400));
    }
    const admin = getPatient(aid);
    req.patient = admin;
  } else {
    const patient = getPatient(pid);
    req.patient = patient;
  }
  return next();
}

module.exports = {
  checkAuthentication,
};
