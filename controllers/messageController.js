const { body, validationResult } = require("express-validator");
const Message = require("../models/MessageSchema");
const { findByIdAndDelete } = require("../models/UserSchema");
const User = require("../models/UserSchema");

exports.new_message_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Title is required")
    .escape(),
  body("message")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Message must contain at least 3 characters")
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const message = new Message({
      title: req.body.title,
      content: req.body.message,
      timestamp: Date.now(),
      author: res.locals.currentUser._id,
    });

    if (!errors.isEmpty()) {
      res.render("message-form", { title: "New Messgae", errors: errors.array(), message });
    } else {
      await message.save();
      res.redirect("/dashboard");
    }
  },
];

exports.dashboard_get = async (req, res, next) => {
  const messages = await Message.find({}).populate("author").sort({ timestamp: -1 });
  res.render("dashboard", { title: "Home", messages });
};

exports.delete_post = async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
};
