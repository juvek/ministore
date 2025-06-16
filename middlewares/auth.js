const User=require('../models/userSchema')

const userAuth=(req,res,next)=>{
    if(req.session.user){
        User.findById(req.session.user)
          .then(data=>{
            if(data && !data.isBlocked){
                next()
            }else{
                res.redirect('/')
            }
          })
          .catch(error=>{
            console.log("error in userAuth middleware",error)
            res.status(500).send("internal server error")
          })
    }else{
        res.redirect("/")
    }
}


const adminAuth=(req,res,next)=>{
  User.findOne({isAdmin:true})
    .then(data=>{
      if(data){
        next()
      }else{
        redirect('/admin')
      }
    })
    .catch(error=>{
      console.log("error in adminAuth middleware",error)
      res.status(500).send("internal server error")
    })
    
}




module.exports={userAuth,adminAuth}