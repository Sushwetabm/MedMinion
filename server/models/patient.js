const mongoose=require('mongoose')
const validator=require('validator')

const patientSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"First Name must contain atleast 3 characters"]
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"Provide a valid email!"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"Phone Number must contain only 10 digits"],
        maxLength:[10,"Phone Number must contain only 10 digits"],
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    pdf:{
        type: String,
        required:[true,"Please upload Patient pdf"],
      }
})

const PatientModel=new mongoose.model('patient',patientSchema)
module.exports=PatientModel