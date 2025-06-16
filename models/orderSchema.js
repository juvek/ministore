const mongoose=require('mongoose')
const {Schema}=mongoose
const {v4:uuidv4}=require('uuid')

const orderSchema=new Schema({
    orderId:{
        type:Schema.Types.ObjectId,
        default:()=>uuidv4(),
        unique:true,
    },
    ordererItems:[{
        product:{
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
        
    }],

    totalPrice:{
        type:Number,
        required:true
    },

    discount:{
        type:Number,
        default:0
    },
    finalAmount:{
        type:Number,
        required:true
    },
    address:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    invoiceDate:{
        type:Date
    },
    status:{
        type:String,
        required:true,
        enum:['pending','processing','shipped','delivered','cancelled','return request','returned']
    },
    
    createdOn:{
        type:Date,
        default:Date.now,
        required:true
    },
    couponApplied:{
        type:Boolean,
        default:false
    }
})

const order=mongoose.model("order",orderSchema)

module.exports=order