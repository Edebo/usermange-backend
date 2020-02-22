import express from "express";
import { requireSignin } from "../controller/auth";
// import { runValidation } from "../validator";
// import { userSignupValidator, userSigninValidator } from "../validator/auth";
import { getUsers, getUser, editUser, deleteUser } from "../controller/user";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/profile/:id", requireSignin, editUser);
router.delete("/:id", requireSignin, deleteUser);

module.exports = router;
