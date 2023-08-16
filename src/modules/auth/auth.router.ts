import RequestValidator from "../../common/validation";
import container from "../../di/inversify.config";
import { AuthController } from "./auth.controller";
import {Router} from "express";
import { EmailVerifyDto, ForgotPasswordDto, ResetPasswordDto, SignInDto, SignUpDto } from "./auth.dtos";
import { protect } from "../../common/auth";
import passport from "passport";
import "../../common/passport"


const authController = container.resolve<AuthController>(AuthController);
export const router = Router();

router.post("/signup", RequestValidator.validate(SignUpDto), authController.signUp)
router.post("/signin", RequestValidator.validate(SignInDto), authController.signIn)
router.post("/logout", protect(), authController.logout)
router.post("/forgot-password", RequestValidator.validate(ForgotPasswordDto), authController.forgotPassword)
router.post("/reset-password", RequestValidator.validate(ResetPasswordDto), authController.resetPassword)
router.get("/access-token", authController.getAccessToken)
router.get("/verify-with-email", RequestValidator.validate(EmailVerifyDto), authController.getVerficiationMailwithEmail)
router.get("/verification", protect(), authController.getVerficiationMail)
router.get("/verify-email", authController.verifyEmail);
router.get("/google/authenticate-user", passport.authenticate("google", {scope: ["profile", "email"] }))
router.get("/google/sign-in", passport.authenticate("google"), authController.googleSignOn);
