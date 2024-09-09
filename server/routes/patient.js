const express=require('express')
const { HandlePatientSignUp, HandlePatientLogin } = require('../controllers/patient')

const PatientRouter=express.Router()

PatientRouter.post('/signup',HandlePatientSignUp)
PatientRouter.post('/login',HandlePatientLogin)


module.exports=PatientRouter