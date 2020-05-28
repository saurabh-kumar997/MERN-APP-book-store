const express = require("express")
const router = express.Router();
const category = require("../models/category")

const {getCategoryById, 
    createCategory, 
    getAllCategory, 
    getCategory, 
    updateCategory, 
    removeCategory} = require("../controllers/category")
const {isSignedIn, isAdmin, isAuthenticate } = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//param
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Post Routers
router.post("/category/create/:userId",isSignedIn, 
isAuthenticate, 
isAdmin, 
createCategory)

//Get Routers
router.get("/category", getAllCategory)
router.get("/category/:categoryId", getCategory)

//Update Routers
router.put("/category/:categoryId/:userId",isSignedIn, 
isAuthenticate, 
isAdmin, 
updateCategory)


//Delete Routers
router.delete("/category/:categoryId/:userId",isSignedIn, 
isAuthenticate, 
isAdmin, 
removeCategory)


module.exports = router;