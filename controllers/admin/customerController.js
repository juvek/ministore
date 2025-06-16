const User=require("../../models/userSchema")



const customerinfo=async (req,res)=>{
    try {
        let search=""
        if(req.query.search){
            search=req.query.search
        }
        let page=1
        if(req.query.page){
            page=req.query.page
        }
        limit=4
        const userData=await User.find({
            isAdmin:false,
            $or:[{fullname:{$regex:".*"+search+".*"}},
                 {email:{$regex:".*"+search+".*"}}
            ]
        })
        .limit(limit*1)
        .skip((page-1)*limit)
        .exec();

        const count=await User.find({
            isAdmin:false,
            $or:[{fullname:{$regex:".*"+search+".*"}},
                 {email:{$regex:".*"+search+".*"}}
            ]
        }).countDocuments()

        res.render('admin/customers',{
            data: userData, 
            totalpages: Math.ceil(count / limit), // Note lowercase to match template
            currentpage: page, // Note lowercase to match template
            search: search
        })

    } catch (error) {
        console.error("error in customer info",error)
    }
}

const customerblocked=async (req,res)=>{
    try {
        let id=req.query.id
        await User.updateOne({_id:id},{$set:{isBlocked:true}})
        res.redirect('/admin/users')
    } catch (error) {
        res.redirect('/pageerror')
        
    }
}

const customerunblocked=async (req,res)=>{
     try {
        let id=req.query.id
        await User.updateOne({_id:id},{$set:{isBlocked:false}})
        res.redirect('/admin/users')
    } catch (error) {
        res.redirect('/pageerror')
        
    }
}


module.exports={customerinfo,customerblocked,customerunblocked}