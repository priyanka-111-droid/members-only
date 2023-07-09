const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");

exports.sign_up_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  body("email")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password must be at least 6 character long"),

  async (req, res) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) throw err;
      const newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: hashedPassword,
        member: false,
      });

      if (errors.isEmpty()) {
        await newUser.save();
        res.render("login");
      } else {
        res.render("sign-up", { title: "Sign Up", user: newUser, errors: errors.array() });
      }
    });
  },
];
