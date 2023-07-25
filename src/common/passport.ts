import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UnAuthorizedError } from "./error";
import { prisma } from "../database/prisma.service";
import { User } from "@prisma/client";


const GOOGLE_CLIENTID = process.env.GOOGLE_CLIENTID as string;
const GOOGLE_CLIENTSECRET = process.env.GOOGLE_CLIENTSECRET as string;

passport.use(
    new GoogleStrategy(
        {
            clientID:GOOGLE_CLIENTID,
            clientSecret: GOOGLE_CLIENTSECRET,
            callbackURL: `${process.env.API_URL}/api/v1/auth/google/redirect`
        }, async(acessToken, refreshToken, profile, done)=>{
                const {email, email_verified, family_name, name} = profile._json;
                // Throws an error if user gmail is not verified
                if(email_verified == "false"){
                    throw new UnAuthorizedError("Google Email not Verified")
                }
                /*
                - Check if user with email already exists
                - If false, create an new user with email and set verification and googleSignOn Status to true
                - Todo: Handle logic for users that initially signed up with password asking them to reset their password
                - instead. Well the idea I intend using now is to attach an error object to the the done callback and find
                - a way to extract and pass to the front end redirect url
                 */
                let user = await prisma.user.findUnique({
                    where: {email}
                });
                if(!user){
                    user = await prisma.user.create({
                        data:{
                            firstName: name!,
                            lastName: family_name!,
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