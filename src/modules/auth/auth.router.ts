import RequestValidator from "../../common/validation";
import container from "../../di/inversify.config";
import { AuthController } from "./auth.controller";
import {Router} from "express";
import "express-async-errors";
import { AddProfile, ForgotPassword, ResetPassword, SignIn, SignUp } from "./auth.validation";
import { protect } from "../../common/auth";
import passport from "passport";
import "../../common/passport"


const authController = container.resolve<AuthController>(AuthController);
const authRouter = Router();

authRouter.post("/signup", RequestValidator.validate(SignUp), authController.signUp)
authRouter.post("/signin", RequestValidator.validate(SignIn), authController.signIn)
authRouter.post("/profile", RequestValidator.validate(AddProfile), authController.addProfile)
authRouter.post("/logout", protect, authController.logout)
authRouter.post("/forgot-password", RequestValidator.validate(ForgotPassword), authController.signIn)
authRouter.post("/reset-password", RequestValidator.validate(ResetPassword), authController.resetPassword)
authRouter.get("/verification", protect, authController.getVerficiationMail)
authRouter.post("/verification", authController.verifyEmail);
authRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"] }))
authRouter.post("/google/redirect", passport.authenticate("google"), authController.googleSignOn);

export default authRouter;