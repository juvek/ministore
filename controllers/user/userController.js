
const User=require("../../models/userSchema")
const nodemailer=require('nodemailer')
const env=require('dotenv').config()
const bcrypt=require('bcrypt')
const session = require("express-session")
const saltround=10

const pageNotFound=async(req,res)=>{
    try {
        res.render("user/404page")
        
    } catch (error) {
        res.redirect('/pageNotFound')
        
    }
}

const loadLoginpage=async (req,res) => {
    try {
        if(!req.session.user){
            return res.render("userlogin")
        }
        else{
            res.redirect('/home')
        }
    } catch (error) {
        console.log("login page not found")
        res.redirect('/pageNotFound')
    }
    
}

const loadSignuppage=async (req,res) => {
   
    try {
        res.render("usersignup")
    } catch (error) {
        console.log("login page not found")
    }
    
}

const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ isAdmin:0,email:email })
        if (!user) {
            return res.render('userlogin', { message: "Incorrect email" })
        }
        if(user.isBlocked){
            return res.render('userlogin',{message:"user is blocked"})
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.render('userlogin', { message: "Incorrect password" })
        }
        req.session.user = user._id;
        req.session.userData = {fullname: user.fullname, email: user.email}

        res.redirect('/home');

    } catch (error) {
        console.error("Login error:", error);
        res.render('userlogin', { message: "Something went wrong" })
    }
};

            // otp function //

    function generateOtp(){
        return Math.floor(100000+Math.random()*900000).toString()
    }


    async function sendVerificationEmail(email,otp){
        try {
            const transporter=nodemailer.createTransport({
                service:"gmail",
                port:587,
                secure:false,
                requireTLS:true,
                auth:{
                    user:process.env.NODEMAILER_EMAIL,
                    pass:process.env.NODEMAILER_PASSWORD
                }
            })

            const info=await transporter.sendMail({
                from:process.env.NODEMAILER_EMAIL,
                to:email,
                subject:"verify email ",
                text:`your otp is ${otp}`,
                html:`<b> your OTP ${otp}</b>`
            })

            return info.accepted.length>0

        } catch (error) {
            console.log("Error sending email",error)
            return false;

            
        }
    }

    //signup //

const signup=async(req,res)=>{
   // const {fullname,email,mobile,password}=req.body

    console.log("Received body:", req.body);
    try {

        const {fullname,email,mobile,password,confirmPassword}=req.body

        if (!fullname || !email || !mobile || !password || !confirmPassword) {
            return res.render('user/usersignup', { message: "All fields are required" });
        }
        
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.render('usersignup', { message: "Email already exists" });
        }

        if(password!=confirmPassword){
            return res.render('usersignup', { message: "password not matched" });

        }

        const otp=generateOtp()
        console.log("otp",otp)

        const emailsend=await sendVerificationEmail(email,otp)
           if(!emailsend){
             return res.json("email error")
            }

            req.session.userOtp=otp;
            req.session.userData={fullname,email,mobile,password}
              //return res.json({ success: true, message: "OTP sent" });

            res.render('verifyotp')
            console.log("otp send",otp)
    } catch (error) {

        console.log("signup error",error)
        res.redirect("/404page")
        
    }
}

const  securePassword = async (password)=>{
    try {
         const hashedPassword = await bcrypt.hash(password, saltround)
         return hashedPassword;
    } catch (error) {
        console.error("error occured",error)
    }
}

const verifyotp=async(req,res)=>{
    try {
        const {otp}=req.body
        if(otp===req.session.userOtp){
            const user=req.session.userData
            const passwordHash= await securePassword(user.password)

            const newUser= new User({
                fullname:user.fullname,
                email:user.email,
                mobile:user.mobile,
                password:passwordHash})

        console.log(newUser)
        await newUser.save()
        req.session.user=newUser._id
        res.json({success:true,redirectUrl:"/"})
        }
        else{
            res.status(400).json({success:false,message:"Invalid otp , try again"})
        }
        
    } catch (error) {
          console.error("error verifying otp",error)
          res.status(500).json({success:false,message:"error occured"})
    }
}

const resendotp=async (req,res)=>{

    try {
        const {email}=req.session.userData
        if(!email){
            res.status(400).json({success:false,message:"email not found in session"})
        }
        const otp=generateOtp()
        req.session.userOtp=otp

        const emailsend=await sendVerificationEmail(email,otp)
        if(emailsend){
            console.log("resend otp :",otp)
            res.status(200).json({success:true,message:"otp resend successfully"})
        }else{
            res.status(500).json({sucess:false,message:"failed to send otp"})
        }
    } catch (error) {
        console.error("error resending otp",error)
        res.status(500).json({sucess:false,message:"internal sever error failed to resend otp"})
    }
}



const loadHomepage=async (req,res) => {

   
        try {
            const user=req.session.user
            if(user) {
                const userData=await User.findById(user)
                res.render("home", {user:userData,fullname:userData.fullname});
            } else {
                res.redirect('/'); // or to login page
            }
    } catch (error) {
        console.log("home page not found")
    }
    
}

const loadShoppage=async (req,res) => {

    try {
        const user=req.session.user

        if(user){
             const userData=await User.findOne({_id:user._id})
             res.render("user/shop",{user:userData})
        }
        else{
            return res.render("userlogin")
         }
    } catch (error) {
        console.log("home page not found")
    }
    
}

const signout= async (req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log("error occured",err)
                return res.redirect('/pageNotFound')
            }
            
            return res.redirect('/')
        })
    } catch (error) {
        console.error("logout error",error)
    }
}


module.exports={loadHomepage,pageNotFound,loadLoginpage,loadSignuppage,signup,verifyotp,resendotp,
                loginuser,loadShoppage,signout}