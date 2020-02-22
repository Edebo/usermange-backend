import User from "../model/user";
import formidable from "formidable";
import mongoose from "mongoose";
exports.getUsers = async (req, res) => {
  console.log("i got here");
  try {
    let users = await User.find({
      active: true
    }).select({
      hash_password: -1,
      _id: 1,
      email: 1,
      profileImg: 1,
      username: 1
    });

    return res.json({
      status: "success",
      users
    });
  } catch (err) {
    return res.json({
      status: "error",
      message: "Cannot fetch users"
    });
  }
};

exports.getUser = async (req, res) => {
  const id = req.params.id;
  try {
    let user = await User.find({
      _id: id,
      active: true
    }).select({ hash_password: -1 });

    return res.status(200).json({
      status: "success",
      user
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Cannot fetch usesrs"
    });
  }
};
exports.editUser = async (req, res) => {
  try {
    const { id } = mongoose.Types.ObjectId(req.params.id);
    const { username } = req.body;

    if (!username || username.length < 3) {
      return res.json({
        status: "error",
        message: "Username cannot be empty"
      });
    }
    const user = await User.findByIdAndUpdate(
      {
        _id: id
      },
      { username },
      { runValidators: true, new: true }
    ).select({
      hash_password: -1,
      _id: 1,
      email: 1,
      profileImg: 1,
      username: 1
    });

    console.log(user);
    if (!user) {
      return res.json({
        status: "error",
        message: "user deactivated or user not found"
      });
    }

    return res.json({
      status: "success",
      message: "Update successful",
      data: user
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: "error",
      message: "Cannot Update"
    });
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  if (req.user._id !== id) {
    return res.json({
      status: "error",
      message: "Not authorized"
    });
  }

  try {
    await User.findByIdAndUpdate(
      {
        _id: id,
        active: true
      },
      { $set: { active: false } }
    ).select({ hash_password: -1 });

    return res.status(200).json({
      status: "success",
      message: "Successfully delete your account"
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Cannot fetch users"
    });
  }
};
