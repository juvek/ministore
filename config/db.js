const mongoose=require('mongoose')
const env=require('dotenv').config()

const connectDB= async ()=>{

    try {

        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB CONNECTED")
        
    } catch (error) {

        console.log("db connection failed",error.message)
        
    }
}

module.exports=connectDB
