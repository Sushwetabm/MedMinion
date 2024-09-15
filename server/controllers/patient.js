const { errorHandler } = require("../error");
const bcrypt = require("bcryptjs");
const PATIENT = require("../models/patient");
const multer=require("multer");
const { setPatient, getPatient } = require("../services/auth");


const Storage= multer.diskStorage({
  destination:"./uploads",
  filename:(req,file,cb)=>{
    cb(null,Date.now()+file.originalname);
  },
});

const upload=multer({
  storage:Storage
}).single("reports")



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

async function getPatientInfo(req, res) {
  const token=req.cookies.pid;
  const patient=getPatient(token);
  const mail=patient.email;
  const event= await PATIENT.find({email:mail})

  return res.json({msg: event})
}

async function HandlePatientReports(req, res, next) {
  const { patientName, patientEmail } = req.body;

  if (!patientEmail || !patientName) {
    return next(new errorHandler("Please fill all the required details!", 400));
  }

  try {
    // Ensure that the file is uploaded and exists
    if (!req.file || !req.file.filename) {
      return next(new errorHandler("PDF file is required!", 400));
    }

    const imagePath = '/uploads/' + req.file.filename;
  
    const patient = await PATIENT.findOne({ email: patientEmail, name: patientName });

    if (!patient) {
      return next(new errorHandler("Patient not found!", 404));
    }

    patient.pdf = imagePath;
    await patient.save();

    return res
      .status(200)
      .json({ success: true, message: "Details and PDF stored successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return next(new errorHandler(validationErrors.join(" , "), 400));
    }
    return next(error);
  }
}


module.exports = {
  HandlePatientSignUp,
  HandlePatientLogin,
  getPatientInfo,
  upload,
  HandlePatientReports,
};
