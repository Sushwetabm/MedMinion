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
    age: {
        type:Number,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    pdf:{
        type: String,
        
      }
})

const PatientModel=new mongoose.model('patient',patientSchema)
module.exports=PatientModel