const mongoose=require('mongoose')

mongooseConnect=()=>{
    mongoose.connect(process.env.mongo_URI,{
        dbName:"MedMinion"
    }).then(()=>{
        console.log("Database successfully connected")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports=mongooseConnect;
