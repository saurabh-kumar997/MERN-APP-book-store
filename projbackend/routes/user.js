const express = require("express");
const router = express.Router();
const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user")
const {isAdmin, isAuthenticate, isSignedIn} = require("../controllers/auth")

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticate, getUser)
router.put("/user/:userId", isSignedIn, isAuthenticate, updateUser)
router.get("/user/:userId", isSignedIn, isAuthenticate, userPurchaseList)

module.exports = router;