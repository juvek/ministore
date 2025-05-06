var express = require('express');
var router = express.Router();
const userController=require("../controllers/user/userController")

/* GET home page. */
router.get('/pagenotfound',userController.pageNotFound)
router.get('/', userController.loadHomepage);


module.exports = router;
