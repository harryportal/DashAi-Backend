import RequestValidator from "../../common/validation";
import container from "../../di/inversify.config";
import { AuthController } from "./auth.controller";
import {Router} from "express";
import "express-async-errors";
import { AddProfileDto, ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from "./auth.dtos";
import { protect } from "../../common/auth";
import passport from "passport";
import "../../common/passport"


const authController = container.resolve<AuthController>(AuthController);
const authRouter = Router();

authRouter.post("/signup", RequestValidator.validate(SignUpDto), authController.signUp)
authRouter.post("/signin", RequestValidator.validate(SignInDto), authController.signIn)
authRouter.post("/profile", RequestValidator.validate(AddProfileDto), authController.addProfile)
authRouter.post("/logout", protect, authController.logout)
authRouter.post("/forgot-password", RequestValidator.validate(ForgotPasswordDto), authController.forgotPassword)
authRouter.post("/reset-password", RequestValidator.validate(ResetPasswordDto), authController.resetPassword)
authRouter.get("/verification", protect, authController.getVerficiationMail)
authRouter.post("/verification", authController.verifyEmail);
authRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"] }))
authRouter.get("/google/redirect", passport.authenticate("google"), authController.googleSignOn);

export default authRouter;