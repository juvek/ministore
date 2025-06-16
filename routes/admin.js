var express = require('express');
var router = express.Router();
const adminController=require('../controllers/admin/adminController')
const customerController=require('../controllers/admin/customerController')
const categoryController=require('../controllers/admin/categoryContoller')
const {userAuth,adminAuth}=require('../middlewares/auth')


/* GET users listing. */
router.get('/pageerror',adminController.pageerror)
router.get('/',adminController.loadlogin);
router.post('/login',adminController.adminlogin)
router.get('/dashboard',adminAuth,adminController.loaddashboard)
router.get('/logout',adminController.logout)

router.get('/users',adminAuth,customerController.customerinfo)
router.get('/blockcustomer',adminAuth,customerController.customerblocked)
router.get('/unblockcustomer',adminAuth,customerController.customerunblocked)

router.get('/category',adminAuth,categoryController.categoryinfo)
router.post('/addcategory',adminAuth,categoryController.addcategory)
router.post('/addcategoryoffer',adminAuth,categoryController.addcategoryoffer)
router.post("/removecategoryoffer",adminAuth,categoryController.removecategoryoffer)
router.get('/listcategory',adminAuth,categoryController.listcategory)
router.get('/unlistcategory',adminAuth,categoryController.unlistcategory)
router.get('/editcategory',adminAuth,categoryController.geteditcategory)
router.post('/editcategory/:id',adminAuth,categoryController.editcategory)

module.exports = router;
