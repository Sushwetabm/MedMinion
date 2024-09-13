const mongoose=require('mongoose')
const validator=require('validator')

const doctorSchema=new mongoose.Schema({
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
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    yourDomain: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
})

const DoctorModel=new mongoose.model('doctor',doctorSchema)
module.exports=DoctorModel