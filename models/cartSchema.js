const mongoose=require('mongoose')
const {Schema}=mongoose

const cartSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    items:[{
        productId:{
            type:Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        totalPrice:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            default:"placed"
        },
        cancelationReason:{
            type:String,
            default:"none"
        }

    }]
})

const cart=mongoose.model("cart",cartSchema)

module.exports=cart