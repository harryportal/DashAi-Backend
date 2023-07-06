import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UnAuthorizedError } from "./error";


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

        }
    )
)