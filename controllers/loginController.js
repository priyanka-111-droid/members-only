const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/UserSchema");


exports.login_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape(),

  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
];

exports.join_post = async function (req, res, next) {
  if (req.body.password === process.env.SECRET_PASSWORD) {
    await User.findByIdAndUpdate(res.locals.currentUser._id, { member: true });
    res.redirect("/dashboard");
  } else {
    res.render("join", { error: "Incorrect Password" });
  }
};

exports.admin_post = async function (req, res, next) {
  if (req.body.password === process.env.ADMIN_PASSWORD) {
    await User.findByIdAndUpdate(res.locals.currentUser._id, { admin: true });
    res.redirect("/dashboard");
  } else {
    res.render("admin", { error: "Incorrect Password" });
  }
};
