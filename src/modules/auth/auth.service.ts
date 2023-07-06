import { User } from "@prisma/client";
import { BadRequestError, ConflictError, ForbiddenError, UnAuthorizedError } from "../../common/error";
import { comparePassword, createAcessToken, createRefreshToken, createResetToken, createVerificationToken, hashPassword, verifyJWT } from "../../utils/jwtAuth/jwt";
import { AuthTypes, IAuthRepository, IAuthService, ISignInResponse, UserProfile, jwtPayload, updateUser } from "./auth.dto";
import { injectable, inject } from "inversify";
import { createresetTemplate } from "../../utils/mailTemplates/resetPassword";
import { completeprofileTemplate } from "../../utils/mailTemplates/completeProfile";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";


@injectable()
export class AuthService implements IAuthService{
    private authRepository: IAuthRepository;
    private mailService: IEmailQueue;
    constructor(@inject(AuthTypes.IAuthRepository)authRepository:IAuthRepository,
    @inject(MailTypes.IEmailQueue)mailService:IEmailQueue){
        this.authRepository = authRepository;
        this.mailService = mailService;
    }

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
    private async sendVerificationmail(email:string,verificationToken:string):Promise<void>{
        const verifyEmailUrl = `${process.env.FRONTENDURL}/${verificationToken}`;
        const mailtemplate = completeprofileTemplate(verifyEmailUrl);
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
    public async signUp(email:string, password:string):Promise<void>{
        let user = await this.authRepository.getUserwithEmail(email);
        if(user){ throw new ConflictError("Email Already Exists. Please use another email Adress") }
        const hashedpassword = await hashPassword(password);
        user = await this.authRepository.createUser(email, hashedpassword);
        const verificationToken = createVerificationToken(email, user.id);
        await this.authRepository.addVerificationToken(user.id, verificationToken);
        await this.sendVerificationmail(email,verificationToken);
    }

    /**
     * Verifies that the token is still valid.
     * Fetch the user to check that the token is currently associated the with user 
     * ( it won't if the user has requested for a new verification link after the current one was requested ). 
     * If valid, delete the verification token from the user and mark the user verified
     * @param verificationToken - jwt verification token
     */
    public async verifyEmail(verificationToken:string):Promise<void>{
        const jwtPayload = this.verifyJwtandThrow(verificationToken);
        const user = await this.authRepository.getUserwithId(jwtPayload.id) as User;
        if(!user || (user.verificationToken != verificationToken)){
            throw new UnAuthorizedError("Invalid or Expired Token!")
        }
        await this.authRepository.deleteVerificationToken(jwtPayload.email);
        await this.authRepository.verifyUser(jwtPayload.id);
    }

    /**
     * Verifies that a user with email exists.
     * Compares the passowrd with user's hashed password.
     * Create and returns access, refresh tokens and the user onboarding status
     * @param email 
     * @param password 
     * @returns access and refresh tokens
     */
    public async signIn(email:string, password:string):Promise<ISignInResponse>{
        const user = await this.authRepository.getUserwithEmail(email.toLowerCase());
        if(!user) { throw new UnAuthorizedError("Invalid Login Credentials") }

        const checkPassword = await comparePassword(password, user.password!)
        if(!checkPassword) { throw new UnAuthorizedError("Invalid Login Credentials") }

        const accessToken =  createAcessToken(user);
        const refreshToken = createRefreshToken(user);
        const onboardingStatus = user.activeStatus;
        const verificationStatus = user.verified;
        const refreshTokenTime = process.env.REFRESHTOKEN_EXPIREAT as unknown as number; // no of days
        const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTime * 24 * 60 * 60 * 1000); 

        await this.authRepository.createRefreshToken(refreshToken, refreshTokenExpiresAt, user.id)
        return {accessToken, refreshToken, onboardingStatus, verificationStatus};
    }

    /**
     * Verifies that a user with the id exists.
     * Verifies that the user's email address has been verified.
     * Adds and return the newly added profile.
     * @param profile 
     * @param id 
     * @returns the newly added profile
     */
    public async addProfile(profile:updateUser, id:string):Promise<UserProfile>{
        const user = await this.authRepository.getUserwithId(id);
        if(!user){ throw new UnAuthorizedError("No user with Provided with Credentials") };
        if(!user.verified) { throw new ForbiddenError("Please verify your email address to Continue")}
        let addedProfile = await this.authRepository.addUserProfile(id, profile);
        const {password, verificationToken, ...newProfile} = addedProfile;
        return newProfile;
    }

    /**
     * Checks if the user is not already verified.
     * If true, deletes the current verification token associated with the user 
     * if any and creates a new token. Attach the token to the user and call the send 
     * verification email function.
     * @param email 
     */
    public async getVerificationMail(email:string){
        const user = await this.authRepository.getUserwithEmail(email) as User;
        if(!user.verified){
            await this.authRepository.deleteVerificationToken(email);
            const verificationToken = createVerificationToken(email ,user.id);
            await this.authRepository.addVerificationToken(user.id, verificationToken);
            this.sendVerificationmail(email, verificationToken);
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
        const hashedPassword = await hashPassword(password);
        await this.authRepository.resetPassword(jwtPayload.id, hashedPassword);
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
        const user = await this.authRepository.getUserwithEmail(email) as User;
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
            await this.authRepository.deleteRefreshToken(refreshToken);
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
        const user = await this.authRepository.getUserwithEmail(email.toLowerCase()) as User;
        if(!user) { throw new BadRequestError("No User with Email Address!") }
        const userToken = createResetToken(user.email, user.id)

        //the user might have no name since they should be able to reset password without onbaording
        let name:string = user.name ??  "";  
        await this.sendResetPasswordmail(userToken, email, name);    
    }
}