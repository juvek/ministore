const User=require('../../models/userSchema')
const session=require('express-session')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')


const pageerror=(req,res)=>{
    res.render('adminerror')
}

const loadlogin=(req,res)=>{
    if(req.session.admin){
        return res.redirect("/admin/dashboard")
    }
     res.render("adminlogin")
}

const adminlogin=async (req,res)=>{
     try {
        const { email, password } = req.body

        const admin = await User.findOne({ isAdmin:true,email })
        if (!admin) {
            return res.render('adminlogin', { message: "Incorrect email" })
        }
       

        const isMatch = await bcrypt.compare(password,admin.password);
        if (!isMatch) {
            return res.render('adminlogin', { message: "Incorrect password" })
        }
        req.session.admin = admin._id;
        req.session.adminData = {email: admin.email}

        return res.redirect('/admin/dashboard');

    } catch (error) {
        console.error("Login error:", error);
        res.render('adminlogin', { message: "Something went wrong" })
    }

}

const loaddashboard=async (req,res)=>{
    if(req.session.admin){
        try {
            res.render("dashboard")
        } catch (error) {
            res.redirect('/pageerror')
        }
    }
}

const logout=async (req,res)=>{
    try {
        req.session.destroy(err=>{
            if(err){
                console.log("error destroying session",err)
                return res.redirect("/pageerror")
            }
            res.redirect('/admin')
        })
    } catch (error) {
        console.log("unexpected error",error)
        res.redirect('/pageerror')
    }
}

module.exports={pageerror,loadlogin,adminlogin,loaddashboard,logout}