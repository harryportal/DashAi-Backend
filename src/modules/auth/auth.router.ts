import RequestValidator from "../../common/validation";
import container from "../../di/inversify.config";
import { AuthController } from "./auth.controller";
import {Router} from "express";
import { AddProfile, ForgotPassword, ResetPassword, SignIn, SignUp } from "./auth.validation";
import { protect } from "../../common/auth";

const authController = container.resolve<AuthController>(AuthController);
const authRouter = Router();

authRouter.post("/signup", RequestValidator.validate(SignUp), authController.signUp)
authRouter.post("/signin", RequestValidator.validate(SignIn), authController.signIn)
authRouter.post("/profile", RequestValidator.validate(AddProfile), authController.addProfile)
authRouter.post("/logout", authController.logout )
authRouter.post("/forgotpassoword", RequestValidator.validate(ForgotPassword), authController.forgotPassword)
authRouter.post("/resetpassword", RequestValidator.validate(ResetPassword), authController.resetPassword)
authRouter.get("/verification", protect, authController.getVerficiationMail)

export default authRouter;