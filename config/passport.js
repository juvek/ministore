const passport=require('passport')
const Googlestrategy=require('passport-google-oauth20').Strategy
const User=require('../models/userSchema')

const env=require('dotenv').config()

passport.use(new Googlestrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:'/auth/google/callback'
},

async(accesstoken,refreshtoken,profile,done)=>{
    try {
        let user=await User.findOne({googleId:profile.id})
        if(user){
            return done(null,user)
        }else{
            user=new User({
                fullname:profile.displayName,
                email:profile.emails[0].value,
                googleId:profile.id
            })

            await user.save()
            return done(null,user)
        }
    } catch (err) {
        return done(err,null)
    }
}

))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id)
        .then(user=>{
            done(null,user)
        })
        .catch(err=>{
            done(err,null)
        })
})


module.exports=passport