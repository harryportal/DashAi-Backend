import { User } from "@prisma/client";
import { BadRequestError, ConflictError, ForbiddenError, UnAuthorizedError } from "../../common/error";
import removePassword from "../../utils/db/excludeKey";
import { comparePassword, createAcessToken, createRefreshToken, createResetToken, createVerificationToken, hashPassword, verifyJWT } from "../../utils/jwtAuth/jwt";
import { AuthTypes, IAuthRepository, UserProfile, jwtPayload, updateUser } from "./auth.dto";
import { injectable, inject } from "inversify";
import { createresetTemplate } from "../../utils/mailTemplates/resetPassword";
import { completeprofileTemplate } from "../../utils/mailTemplates/completeProfile";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";


@injectable()
export class AuthService{
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
     */
    private verifyJwtandThrow(token:string):jwtPayload{
        const verifiedPayload = verifyJWT(token);
        if(!verifiedPayload) { throw new UnAuthorizedError("Invalid Credentials Provided!") }
        return verifiedPayload
    }

    /**
     * Creates a jwt token(exp time of 24hrs) with the user email in the payload.
     * Pass the token to the email template and call the email service to send the mail
     * @param email 
     * @param id - user id
     */
    private async sendVerificationmail(email:string, id:string){
        const verificationToken = createVerificationToken(email, id);
        const verifyEmailUrl = `${process.env.FRONTENDURL}/${verificationToken}`;
        const mailtemplate = completeprofileTemplate(verifyEmailUrl);
        await this.mailService.addEmailToQueue({to:email, subject: "Verify Your Email Address", html:mailtemplate})
    }
    
    
    /**
     * Verifies that a user with the email provided doesn't already exist.
     * Hash the password and create the user with the email and hashed password.
     * Sends a verification mail to the email address.
     * @param email 
     * @param password 
     */
    public async signUp(email:string, password:string){
        let user = await this.authRepository.getUserwithEmail(email);
        if(user){ throw new ConflictError("Email Already Exists. Please use another email Adress") }
        const hashedpassword = await hashPassword(password);
        user = await this.authRepository.createUser(email, hashedpassword);
        await this.sendVerificationmail(email, user.id);

    }

    /**
     * Verifies that a user with email exists.
     * Compares the passowrd with user's hashed password.
     * Create and returns access and refresh tokens.
     * @param email 
     * @param password 
     * @returns access and refresh tokens
     */
    public async signIn(email:string, password:string){
        const user = await this.authRepository.getUserwithEmail(email.toLowerCase());
        if(!user) { throw new UnAuthorizedError("Invalid Login Credentials") }

        const checkPassword = await comparePassword(password, user.password)
        if(!checkPassword) { throw new UnAuthorizedError("Invalid Login Credentials") }

        const accessToken =  createAcessToken(user);
        const refreshToken = createRefreshToken(user);

        const refreshTokenTime = process.env.REFRESHTOKEN_EXPIREAT as unknown as number; // no of days
        const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenTime * 24 * 60 * 60 * 1000); 
        this.authRepository.createRefreshToken(refreshToken, refreshTokenExpiresAt, user.id)
        return {accessToken, refreshToken};
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
        let newProfile = await this.authRepository.addUserProfile(id, profile);
        return removePassword(newProfile);
    }

    /**
     * Verifies the jwt token.
     * Compares the passwords and reset password if matched.
     * @param token - token passed to the frontend url from the verification email.
     * @param password 
     * @param confirmPassword 
     */
    public async resetPassword(token:string, password:string, confirmPassword:string):Promise<void>{
        let user = this.verifyJwtandThrow(token);
        if (password !== confirmPassword){
            throw new BadRequestError("Passwords do not match!")
        }
        const hashedPassword = await hashPassword(password);
        await this.authRepository.resetPassword(user.id, hashedPassword);
    }

    /**
     * Verifies the jwt refresh token.
     * Verifies that the token exists in db and has not expired.
     * If valid, fetch the user from the db and creates the access token.
     * @param refreshToken 
     * @returns a new access Token
     */
    public async getAccessToken(refreshToken:string){
        const verifiedPayload = this.verifyJwtandThrow(refreshToken);
        const token = await this.authRepository.getRefreshToken(refreshToken);
        if (!token || token.expiresAt < new Date) { throw new UnAuthorizedError("Invalid Token Provided") }
        const email = verifiedPayload.email;
        const user = await this.authRepository.getUserwithEmail(email) as User;
        const acessToken = createAcessToken(user);
        return acessToken;
    }

    /**
     * Invalidates a refresh token by deleting it from the database
     * @param refreshToken 
     */
    public deleteRefreshToken = async(refreshToken:string)=>{
        verifyJWT(refreshToken);
        await this.authRepository.deleteRefreshToken(refreshToken);
    }

    /**
     * Verifies that a user with the email address exists.
     * If true, verifies that the user email has been verified.
     * Sends verification mail to the user's email.
     * @param email 
     */
    public async forgotPassword(email:string){
        const user = await this.authRepository.getUserwithEmail(email.toLowerCase()) as User;
        if(!user) { throw new BadRequestError("No Email with associated Account!") }
        if(!user.verified) {throw new BadRequestError("Please verify your email first!")}
        const userToken = createResetToken(user.email, user.name!)

        //the user might have no name since they should be able to reset password without onbaording
        let name:string = user.name ??  "";  

        const addPasswordUrl = `${process.env.FRONTENDRESETURL}/${userToken}`;
        const mailtemplate = createresetTemplate(name, addPasswordUrl);
        await this.mailService.addEmailToQueue({to:email, subject: "Reset Your Password", html:mailtemplate})
}
    



}