import RequestValidator from "../../common/validation";
import container from "../../di/inversify.config";
import { AuthController } from "./auth.controller";
import { Request, Response } from "express";
import {Router} from "express";
import { AddProfile, ForgotPassword, ResetPassword, SignIn, SignUp } from "./auth.validation";
import { protect } from "../../common/auth";
import passport from "passport";
//import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UnAuthorizedError } from "../../common/error";


const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID as string;
const GOOGLE_CLIENTSECRET = process.env.GOOGLECLIENTSECRET as string;

passport.use(
    new GoogleStrategy(
        {
            clientID:GOOGLE_CLIENTID,
            clientSecret: GOOGLE_CLIENTSECRET,
            callbackURL: "/auth/google/redirect",
            scope: []
        }, (acessToken, refreshToken, profile, done)=>{
                const {email, email_verified} = profile._json;
                if(email_verified == "false"){
                    throw new UnAuthorizedError("Google Email not Verified")
                }
                return done(null, email);
        }
    )
)
const authController = container.resolve<AuthController>(AuthController);
const authRouter = Router();

authRouter.post("/signup", RequestValidator.validate(SignUp), authController.signUp)
authRouter.post("/signin", RequestValidator.validate(SignIn), authController.signIn)
// //authRouter.post("/profile", protect, RequestValidator.validate(AddProfile), authController.addProfile)
// authRouter.post("/logout", authController.logout)
// authRouter.post("/forgot-password", RequestValidator.validate(ForgotPassword), authController.signIn)
// authRouter.post("/reset-password", RequestValidator.validate(ResetPassword), authController.resetPassword)
// authRouter.get("/verification", protect, authController.getVerficiationMail)
// authRouter.post("/verification", authController.verifyEmail);
authRouter.get("/google", passport.authenticate("google", {scope: ["profile", "email"] }))
authRouter.get("/google/redirect", passport.authenticate("google"), (req: Request, res: Response) => {
    res.redirect(`/dashboard`)
})
export default authRouter;