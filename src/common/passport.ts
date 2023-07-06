import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UnAuthorizedError } from "./error";
import { prisma } from "../utils/db/prisma";
import { User } from "@prisma/client";


const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID as string;
const GOOGLE_CLIENTSECRET = process.env.GOOGLE_CLIENTSECRET as string;

passport.use(
    new GoogleStrategy(
        {
            clientID:GOOGLE_CLIENTID,
            clientSecret: GOOGLE_CLIENTSECRET,
        }, async(acessToken, refreshToken, profile, done)=>{
                const {email, email_verified} = profile._json;
                // Throws an error if user gmail is not verified
                if(email_verified == "false"){
                    throw new UnAuthorizedError("Google Email not Verified")
                }
                /*
                - Check if user with email already exists
                - If true, ensure that the user signed up with google by checking the googleSignOn Status
                - If false, create an new user with email and set verification and googleSignOn Status to true
                 */
                let user = await prisma.user.findUnique({
                    where: {email}
                });
                if(user && (!user.googleSignOn || !user.verified)){
                    throw new UnAuthorizedError("Account was created with password, Please login or reset password")
                }
                
                if(!user){
                    user = await prisma.user.create({
                        data:{
                            email:email!,
                            verified: true,
                            googleSignOn:true
                        }
                    })
                }
                return done(null, user);
        }
    )
)

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
passport.deserializeUser(async (user:User, done) => {
    const profile = await prisma.user.findUnique({where: {id:user.id }})
    done(null, profile!.id);
  });