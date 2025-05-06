

const pageNotFound=async(req,res)=>{
    try {
        res.render("user/404page")
        
    } catch (error) {
        res.redirect('/pageNotFound')
        
    }
}

const loadHomepage=async (req,res) => {
    try {
        res.render("user/home")
    } catch (error) {
        console.log("home page not found")
    }
    
}


module.exports={loadHomepage,pageNotFound}