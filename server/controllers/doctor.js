const { errorHandler } = require("../error");
const bcrypt = require("bcryptjs");
const DOCTOR = require("../models/doctor");
const { setPatient } = require("../services/auth");

async function HandledoctorSignUp(req, res, next) {
  const { name, email, phone, gender,address,hospitalName, yourDomain,qualification, password } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !gender ||
    !address ||
    !hospitalName ||
    !yourDomain ||
    !qualification ||
    !password
  ) {
    return next(new errorHandler("Please fill all the details!", 400));
  }
  const result_email = await DOCTOR.findOne({ email: email });
  if (result_email) {
    return next(new errorHandler("Email already exists!", 400));
  }
  const result_phone = await DOCTOR.findOne({ phone: phone });
  if (result_phone) {
    return next(new errorHandler("Phone already exists!", 400));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 8);
    await DOCTOR.create({
      name,
      email,
      phone,
      gender,
      address,
      hospitalName,
      yourDomain,
      qualification,
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
async function HandledoctorLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new errorHandler("Please fill all the details!", 400));
  }
  const result = await DOCTOR.findOne({ email: email });
  if (!result) {
    return next(new errorHandler("Email does not exist!", 400));
  }
  const isMatch = await bcrypt.compare(password, result.password);
  if (!isMatch) {
    return next(new errorHandler("Incorrect Password!", 400));
  }
  const token=setPatient(result,"admin");
  res.cookie('aid',token);
  return res.status(200).json({ success: true, message: "Login successfully" });
}
module.exports = {
  HandledoctorSignUp,
  HandledoctorLogin,
};
