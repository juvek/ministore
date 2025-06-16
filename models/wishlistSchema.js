const mongoose=require('mongoose')
const {Schema}=mongoose

const wishlistSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products:{
        productsId:{
            type:Schema.Types.ObjectId,
            ref:"product",
            required:true,
        },
        addedOn:{
            type:Date,
            default:Date.now,
        }
    },
   
})

const wishlist=mongoose.model("wishlist",wishlistSchema)

module.exports=wishlist