const category = require('../../models/categorySchema')
const Category=require('../../models/categorySchema')
const Product=require('../../models/productSchema')


const categoryinfo=async (req,res)=>{
    try {
        page=parseInt(req.query.page)||1
        limit=4
        skip=(page-1)*limit
        const categorydata=await Category.find({})
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);
        
        const totalcategories=await Category.countDocuments();
        const totalpages=Math.ceil(totalcategories/limit);

        res.render('category',{
            cat:categorydata,
            currentpage:page,
            totalpages:totalpages,
            totalcategories:totalcategories
        })


        
    } catch (error) {

        console.error(" error in categogy page",error)
        res.redirect('/pageerror')
        
    }
}

const addcategory=async (req,res)=>{
    const {name,description}=req.body
    try {
        const existingcategory=await Category.findOne({name});
        if(existingcategory){
            return res.status(400).json({error:"category exists"})
        }

        const newcategory= new Category({
            name,description
        })
        await newcategory.save()
        return res.json({message:"category added sucessfully"})

    } catch (error) {
        return res.status(400).json({error:"internal server error"})
    }
}

const addcategoryoffer=async (req,res)=>{
    try {
        const percentage=parseInt(req.body.percentage)
        const categoryid=req.body.categoryid

        const category=await Category.findById(categoryid)
        if(!category){
            return res.status(404).json({status:false,message:"category not found"})
        }

        const products=await Product.find({category:category._id})
        const hasproductoffer=products.some((product)=>{product.productOffer>percentage})
        if(hasproductoffer){
            return res.json({status:false,message:"products within this category already have offer"})
        }
        await Product.updateOne({_id:categoryid},{$set:{categoryOffer:percentage}})

            category.categoryOffer = percentage;
            await category.save();

        for(const product of products){
            product.productOffer=0;
            product.salePrice=product.regularPrice;
            await product.save()
        }
        res.json({status:true})

    } catch (error) {
        res.status(500).json({status:false,message:"internal server error"})
    }
}


const removecategoryoffer=async (req,res)=>{
    try {
        const categoryid=req.body.categoryid
        const category=await Category.findById(categoryid)
        if(!category){
            return res.status(404).json({status:false,message:"category not found"})
        }
        const percentage=category.categoryOffer
        const products=await Product.find({category:category._id})
        if(products.length>0){
             for(const product of products){
            
            product.salePrice+=Math.floor(product.regularPrice*(percentage/100));
            product.productOffer=0
            await product.save()
            }

        }

        category.categoryOffer=0;
        await category.save()

        res.json({status:true})
        
    } catch (error) {
        res.status(500).json({status:false,message:"internal server error"})
    }
}


const listcategory=async (req,res)=>{
    try {
        let id=req.query.id
        await Category.updateOne({_id:id},{$set:{isListed:false}})
        res.redirect('/admin/category')
    } catch (error) {
        res.redirect('/pageerror')
    }
}

const unlistcategory=async (req,res)=>{
    try {
        let id=req.query.id
        await Category.updateOne({_id:id},{$set:{isListed:true}})
        res.redirect('/admin/category')
    } catch (error) {
        res.redirect('/pageerror')
    }

}

const geteditcategory=async (req,res)=>{
    try {
        let id=req.query.id
        const category=await Category.findOne({_id:id})
        res.render('editcategory',{category:category})
    } catch (error) {
        res.redirect('/pageerror')
    }
}

const editcategory=async (req,res)=>{
    try {
        const id=req.params.id
        const {categoryname,description}=req.body
        const existingcategory=await Category.findOne({name:categoryname})
        if(existingcategory){
            res.status(400).json({error:"category exists please choose another name"})
        }
        const updatecategory=await Category.findByIdAndUpdate(id,{
            name:categoryname,
            description:description
        },{new:true})

        if(updatecategory){
            res.redirect('/admin/category')
        }else{
            res.status(400).json({error:"category not found"})
        }

    } catch (error) {
        res.status(500).json({status:false,message:"internal server error"})
    }
}




module.exports={categoryinfo,addcategory,addcategoryoffer,removecategoryoffer,listcategory,unlistcategory,geteditcategory,editcategory}