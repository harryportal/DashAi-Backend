import { User } from "@prisma/client";
import { BadRequestError, ConflictError, UnAuthorizedError } from "../../common/error";
import { comparePassword, createAcessToken, createRefreshToken, createResetToken, createVerificationToken, hashPassword, verifyJWT } from "../../utils/jwtAuth/jwt";
import { Types, ISignInResponse, IToken,jwtPayload } from "./auth.interface";
import { injectable, inject } from "inversify";
import { Types as UserTypes, UserwithProfile } from "../user/user.interface";
import { createresetTemplate } from "../../utils/mailTemplates/resetPassword";
import { completeprofileTemplate } from "../../utils/mailTemplates/completeProfile";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";
import { SignUpDto } from "./auth.dtos";
import AuthRepository from "./auth.repository";
import { UserRepository } from "../user/user.repository";


@injectable()
export class AuthService{
    constructor(@inject(Types.AuthRepository)private readonly authRepository:AuthRepository,
    @inject(UserTypes.UserRepository)private readonly userRepository:UserRepository,
    @inject(MailTypes.IEmailQueue)private readonly mailService:IEmailQueue){}

    /**
     * verifies the token and sends the user payload if valid
     * @param token - jwt token
     * @returns - the verified user payload
     */
    private verifyJwtandThrow(token:string):jwtPayload{
        const verifiedPayload = verifyJWT(token);
        if(!verifiedPayload) { throw new UnAuthorizedError("Invalid or Expired Token!") }
        return verifiedPayload
    }

    /**
     * Creates the verification url from the client's reset url and reset password token
     * Create the mail template with the user name and reset link
     * Add the email task to the background worker
     * @param email 
     * @param verificationToken - verify email jwt token
     */
    private async sendVerificationmail(email:string,verificationToken:string, name:string):Promise<void>{
        const verifyEmailUrl = `${process.env.APIURL}/auth/verify-email?token=${verificationToken}`;
        const mailtemplate = completeprofileTemplate(verifyEmailUrl,name);
        await this.mailService.addEmailToQueue({to:email, subject: "Verify Your Email Address", html:mailtemplate})
    }
    
    /**
     * Creates the reset password url from the client's reset url and reset password token
     * Create the mail template with the user name and reset link
     * Add the email task to the background worker
     * @param token - resetpassword jwt token
     * @param email 
     * @param name 
     */
    private async sendResetPasswordmail(token:string, email:string, name:string):Promise<void>{
        const addPasswordUrl = `${process.env.FRONTENDRESETURL}/${token}`;
        const mailtemplate = createresetTemplate(name, addPasswordUrl);
        await this.mailService.addEmailToQueue({to:email, subject: "Reset Your Password", html:mailtemplate})
    }

    /**
     * Verifies that a user with the email provided doesn't already exist.
     * Hash the password and create the user with the email and hashed password.
     * Creates a jwt token with the user email in the payload, attach it to the user and call the
     * send verification mail function
     * @param email 
     * @param password 
     */
    public async signUp(userInfo:SignUpDto):Promise<void>{
        let {email, firstName, lastName, password } = userInfo;
        password = await hashPassword(password);
        try {
            const user = await this.userRepository.createUser({email, password, lastName, firstName});
            const verificationToken = createVerificationToken(email, user.id);
            const id = user.id;
            await this.userRepository.updateUser({id}, {verificationToken});
            await this.sendVerificationmail(email,verificationToken, user.lastName);
        }catch(err:any){
            throw new ConflictError("Email Already Exists. Please use another email Adress") 
        }
    }

    /**
     * Verifies that the token is still valid.
     * Fetch the user to check that the token is currently associated the with user 
     * ( it won't if the user has requested for a new verification link after the current one was requested ). 
     * If valid, delete the verification token from the user and mark the user verified
     * @param verificationToken - jwt verification token
     */
    public async verifyEmail(verificationToken:string):Promise<string>{
        const jwtPayload = this.verifyJwtandThrow(verificationToken);
        const {email, id } = jwtPayload;
        const user = await this.userRepository.getUser({id}) as User;
        const frontendUrl = process.env.FRONTENDURL
        if(!user || (user.verificationToken != verificationToken)){
            return `${frontendUrl}/verify`
        }
        await this.userRepository.updateUser({email}, {verificationToken:null, verified:true});
        return `${frontendUrl}/verified`
    }

    /**
     * Verifies that a user with email exists.
     * Compares the passowrd with user's hashed password.
     * Create and returns access, refresh tokens and the user onboarding status
     * @param email 
     * @param password 
     * @returns access and refresh tokens
     */
    public async signIn(email:string, _password:string):Promise<ISignInResponse>{
        email = email.toLowerCase();
        const user = await this.userRepository.getUser({email}, {profile:true}) as UserwithProfile;
        if(!user) { throw new UnAuthorizedError("Invalid Login Credentials") }

        const checkPassword = await comparePassword(_password, user.password!)
        if(!checkPassword) { throw new UnAuthorizedError("Invalid Login Credentials") }
        const {refreshToken, accessToken} = await this.generateToken(user);
        const {password, ...userwithoutPassword} = user;
        return {accessToken, refreshToken, user:userwithoutPassword};
    }

    /**
     * Generates the access Token and refresh token from the user object
     * Add the Refresh Token to the database and attach to the user
     * @param user 
     * @returns 
     */
    private async generateToken(user:User):Promise<IToken>{
        const accessToken =  createAcessToken(user);
        const refreshToken = createRefreshToken(user);
        const refreshTokenTime = process.env.REFRESHTOKEN_TIME as unknown as number; // no of days
        const expiresAt = new Date(Date.now() + refreshTokenTime * 24 * 60 * 60 * 1000); 
        const id = user.id;
        await this.authRepository.createRefreshToken({token:refreshToken, expiresAt, user: {connect:{id}}})
        return {refreshToken, accessToken};
    }   

    public async googleSignOn(user:UserwithProfile):Promise<ISignInResponse>{
        const  {accessToken, refreshToken} = await this.generateToken(user);
        return {accessToken, refreshToken, user};
    }

    /**
     * Checks if the user is not already verified.
     * If true, deletes the current verification token associated with the user 
     * if any and creates a new token. Attach the token to the user and call the send 
     * verification email function.
     * @param email 
     */
    public async getVerificationMail(email:string){
        const user = await this.userRepository.getUser({email});
        if(!user) {
            throw new BadRequestError("Email does not exist, Please sign up on dash to get started")
        }
        if(!user.verified){
            await this.userRepository.updateUser({email}, {verificationToken:null});
            const verificationToken = createVerificationToken(email ,user.id);
            await this.userRepository.updateUser({email}, {verificationToken});
            this.sendVerificationmail(email, verificationToken, user.lastName);
        }
    }

    /**
     * Compares the passwords and proceed if matched.
     * Verifies that the jwt token is valid and is a reset token 
     * @param token - token passed to the frontend url from the verification email.
     * @param password 
     * @param confirmPassword 
     */
    public async resetPassword(token:string, password:string, confirmPassword:string):Promise<void>{
        if (password !== confirmPassword){
            throw new BadRequestError("Passwords do not match!")
        }
        let jwtPayload = this.verifyJwtandThrow(token);
        if(jwtPayload.type != "reset"){  // This way, verification and access token can't be used to replace this
            throw new UnAuthorizedError("Invalid or expired Token");
        }
        const id = jwtPayload.id;
        password = await hashPassword(password);
        await this.userRepository.updateUser({id}, {password});
    }

    /**
     * Verifies the jwt refresh token.
     * Verifies that the token exists in db and has not expired.
     * If valid, fetch the user from the db and creates the access token.
     * @param refreshToken 
     * @returns a new access Token
     */
    public async getAccessToken(refreshToken:string):Promise<string>{
        const verifiedPayload = this.verifyJwtandThrow(refreshToken);
        const token = await this.authRepository.getRefreshToken(refreshToken);
        if (!token || token.expiresAt < new Date) { throw new UnAuthorizedError("Invalid Token Provided") }
        const email = verifiedPayload.email;
        const user = await this.userRepository.getUser({email}) as User;
        const acessToken = createAcessToken(user);
        return acessToken;
    }

    /**
     * Verifies the jwt refresh token, checks that is a refresh token and
     * invalidates the refresh token by deleting it from the database
     * @param refreshToken 
     */
    public async deleteRefreshToken(refreshToken:string){
        this.verifyJwtandThrow(refreshToken) as jwtPayload;
        const token = await this.authRepository.getRefreshToken(refreshToken); 
        if(token){
            return await this.authRepository.deleteRefreshToken(refreshToken);
        }else{
            throw new UnAuthorizedError("Invalid or Expired Token");
        }
    }

    /**
     * Verifies that a user with the email address exists.
     * If true, verifies that the user email has been verified.
     * Delete the user's current verification token, create a new verification token and 
     * call the send reset mail method
     * @param email 
     */
    public async forgotPassword(email:string){
        email = email.toLowerCase();
        const user = await this.userRepository.getUser({email}) as UserwithProfile
        if(!user) { throw new BadRequestError("No User with Email Address!") }
        const userToken = createResetToken(user.email, user.id)
        await this.sendResetPasswordmail(userToken, email, user.lastName);    
    }
}