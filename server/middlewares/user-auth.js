// const { getPatient } = require("../services/auth");
// const { errorHandler } = require("../error");

// async function checkAuthentication(req, res, next) {
//   const pid = req.cookies.pid;
//   if (!pid) {
//     const aid = req.cookies?.aid;
//     if (!aid) {
//       return next(new errorHandler("First Login to the website", 400));
//     }
//     const admin = getPatient(aid);
//     req.patient = admin;
//   } else {
//     const patient = getPatient(pid);
//     req.patient = patient;
//   }
//   return next();
// }

// module.exports = {
//   checkAuthentication,
// };

const { getPatient } = require("../services/auth");
const { errorHandler } = require("../error");

async function checkAuthentication(req, res, next) {
  try {
    const pid = req.cookies.pid;
    if (!pid) {
      const aid = req.cookies?.aid;
      if (!aid) {
        console.log(req.cookies)
        return next(new errorHandler("First Login to the website", 400));
      }
      // Assuming getPatient is an async function
      const admin = await getPatient(aid);
      req.patient = admin;
    } else {
      // Assuming getPatient is an async function
      const patient = await getPatient(pid);
      req.patient = patient;
    }
    return next();
  } catch (error) {
    next(new errorHandler("Error during authentication", 500));
  }
}

module.exports = {
  checkAuthentication,
};



