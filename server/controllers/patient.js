const { errorHandler } = require("../error");
const bcrypt = require("bcryptjs");
const PATIENT = require("../models/patient");
const { setPatient } = require("../services/auth");


async function HandlePatientSignUp(req, res, next) {
  // console.log(req.body);

  const { name, email, phone, age, password } = req.body;


  if (!name || !email || !phone || !age || !password) {
    return next(new errorHandler("Please fill all the details!", 400));
  }
  const result_email = await PATIENT.findOne({ email: email });
  if (result_email) {
    return next(new errorHandler("Email already exists!", 400));
  }
  const result_phone = await PATIENT.findOne({ phone: phone });
  if (result_phone) {
    return next(new errorHandler("Phone already exists!", 400));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    // const pdfPath = '/uploads/' + req.file.filename;
    await PATIENT.create({
      name,
      email,
      phone,
      age,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ success: true, message: "Sign Up successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new errorHandler(validationErrors.join(" , ", 400)));
    }
  }
}
async function HandlePatientLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorHandler("Please fill all the details!", 400));
  }
  const result = await PATIENT.findOne({ email: email });
  if (!result) {
    return next(new errorHandler("Email does not exist!", 400));
  }
  const isMatch = await bcrypt.compare(password, result.password);
  if (!isMatch) {
    return next(new errorHandler("Incorrect Password!", 400));
  } 
  const token=setPatient(result,"patient");
  res.cookie('pid',token,{
    httpOnly:true,
  }); 
  return res.status(200).json({ success: true, message: "Login successfully" });
}
module.exports = {
  HandlePatientSignUp,
  HandlePatientLogin
};
