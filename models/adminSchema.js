const mongoose=require('mongoose')

const adminschema=new mongoose.Schema({
    adminemail:{
        type:String,
        required:true
    },
   
    adminpassword:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("Admin",adminschema)