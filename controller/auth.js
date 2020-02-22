import User from "../model/user";
// const shortId = require('shortid')
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import { signupSchema, signinSchema } from "../helper/auth";
import bcrypt from "bcrypt";
exports.signup = async (req, res) => {
  let body = req.body;

  const { error } = signupSchema.validate(body);

  if (error === !undefined) {
  }

  try {
    let user = await User.findOne({
      email: body.email
    });

    if (user) {
      return res.json({
        status: "error",
        message: "email is taken"
      });
    }
    const { email, password, confirmPassword, username } = body;
    if (confirmPassword !== password) {
      return res.status(400).json({
        status: "error",
        message: "Ensure you password is the same as your Confirm Password"
      });
    }
    let hash_password = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, hash_password });

    let result = await newUser.save();
    result.hash_password = undefined;
    res.status(201).json({
      status: "success",
      message: "User successfully create",
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Signup not successful"
    });
  }
};

exports.signin = async (req, res) => {
  const body = req.body;
  const { error } = signinSchema.validate(req.body);

  if (error === !undefined) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data"
    });
  }
  //check if user exist
  try {
    let user = await User.findOne({ email: body.email, active: true });
    if (!user) {
      return res.status(400).json({
        status: "error",
        error: "User with the email doesnt exist.please signup"
      });
    }
    let value = await bcrypt.compare(body.password, user.hash_password);
    if (!value) {
      return res.status(401).json({
        status: "error",
        error: "Email and password doesnt match"
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
      expiresIn: "1d"
    });
    //send token as cookie
    res.cookie("token", token, { expiresIn: "1d" });

    const { _id, email, username, profileImg } = user;

    return res.status(200).json({
      status: "success",
      data: {
        token,
        _id,
        email,
        username,
        profileImg
      }
    });
  } catch (err) {
    return res.status(500).json({
      status: "error"
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    status: "success",
    message: "signout successful"
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.SECRET
});
