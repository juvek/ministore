var express = require('express');
var router = express.Router();
const userController=require("../controllers/user/userController")
const multer=require("multer");
const passport = require('passport');
const upload=multer()

/* GET home page. */
router.get('/pagenotfound',userController.pageNotFound)
router.get('/',userController.loadLoginpage)
router.post('/loginuser',userController.loginuser)
router.get('/signup', userController.loadSignuppage);
router.post('/usersignup',userController.signup)
router.post('/verifyotp',userController.verifyotp)
router.post('/resendotp',userController.resendotp)

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/')
})

router.get('/home', userController.loadHomepage);
router.get('/signout',userController.signout)



module.exports = router;
