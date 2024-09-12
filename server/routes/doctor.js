const express= require('express')
const { HandledoctorSignUp, HandledoctorLogin } = require('../controllers/doctor')

const DoctorRouter=express.Router()

DoctorRouter.post('/signup',HandledoctorSignUp)
DoctorRouter.post('/login',HandledoctorLogin)


module.exports=DoctorRouter