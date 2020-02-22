import express from "express";
import { signup, signin, signout, requireSigin } from "../controller/auth";
// import { runValidation } from "../validator";
// import { userSignupValidator, userSigninValidator } from "../validator/auth";

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
