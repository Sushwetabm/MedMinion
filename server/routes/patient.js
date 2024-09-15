const express=require('express')
const { HandlePatientSignUp, HandlePatientLogin, getPatientInfo,upload,HandlePatientReports } = require('../controllers/patient')
// const { verifyToken } = require('../middleware/auth'); // Your token verification middleware


const PatientRouter=express.Router()

PatientRouter.post('/patient_reports',upload,HandlePatientReports)
PatientRouter.post('/signup',HandlePatientSignUp)
PatientRouter.post('/login',HandlePatientLogin)
PatientRouter.get('/details', getPatientInfo);



module.exports=PatientRouter