const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const exJwt = require("express-jwt");

exports.signup = (req, res) => {
  const user = new User(req.body);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not registered!!",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email or password doesn't match",
      });
    }

    //token generated
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //setiing it to cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  // res.send("user signout");
  res.clearCookie("token");
  res.json({
    message: "User signout",
  });
};

//protected route
exports.isSignedIn = exJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//custom middleware

exports.isAuthenticate = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not an ADMIN, ACCESS DENIED",
    });
  }
  next();
};
