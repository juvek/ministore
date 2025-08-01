
const mongoose=require('mongoose')
const {Schema}=mongoose

const addressSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    address:[{
        addressType:{
            type:String,
            required:true,
        },
        fullname:{
            type:String,
            required:true,
        },
        city:{
            type:String,
            required:true,
        },
        landmark:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        pincode:{
            type:Number,
            required:true,
        },
        phone:{
            type:String,
            required:true,
        },
        altPhone:{
            type:String,
            required:true,
        }
    }]
})

const address=mongoose.model("address",addressSchema)

module.exports=address