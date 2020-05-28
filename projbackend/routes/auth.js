const express = require("express");
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const router = express.Router();

router.get("/signout", signout);

//test route
router.get("/test",isSignedIn, (req,res) => {
  res.json(req.auth)
});

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 5 })
      .withMessage("Name should be atleast 5 characters"),
      check("email").isEmail().withMessage("Please enter a valid email"),
      check("password")
      .isLength({ min: 8 })
      .withMessage("Please! enter a a password of atleast 8 characters"),
  ],
  signup
);

router.post(
  "/signin",[
      check("email").isEmail().withMessage("Please enter a valid email"),
      check("password")
      .isLength({ min: 1 })
      .withMessage("Password field is required"),
  ],
  signin
);

module.exports = router;
