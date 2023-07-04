import { inject, injectable } from "inversify";
import { AuthTypes, IAuthService, updateUser } from "./auth.dto";
import { Request, Response } from "express";
import { AuthRequest } from "./auth.dto";

@injectable()
export class AuthController {
    private authService:IAuthService;
    constructor(@inject(AuthTypes.IAuthService)authService:IAuthService){
        this.authService = authService;
    }

    public async signUp(req:Request, res:Response){
        const {email, password} = req.body;
        await this.authService.signUp(email, password);
        return res.status(201).json({success:true, message:"A verification link has been sent to your email address!"})
    }

    public async signIn(req:Request, res:Response){
        const {email, password} = req.body;
        const {refreshToken, accessToken} = await this.authService.signIn(email, password);
        return res.status(200).json({success:true, data:{refreshToken, accessToken}})
    }

    public async addProfile(req:AuthRequest, res:Response){
        const profileData = req.body as updateUser;
        const userId = req.user!.id;
        const updatedProfile = await this.authService.addProfile(profileData, userId);
        return res.status(200).json({success:true, data:updatedProfile})
    }

    public async getVerficiationMail(req:AuthRequest, res:Response){
        const email = req.user!.email;
        await this.authService.getVerificationMail(email);
        return res.status(200).json({success:true, message:"A verification link has been sent to your email address!"})
    }

    public async logout(req:AuthRequest, res:Response){
        const refreshToken = req.query.token as string;
        await this.authService.deleteRefreshToken(refreshToken);
        return res.status(204);
    }

    public async forgotPassword(req:AuthRequest, res:Response){
        const {email} = req.body;
        await this.authService.forgotPassword(email);
        return res.status(200).json({success:true, message:"A password reset link has been sent to your mail"})
    }

    public async resetPassword(req:AuthRequest, res:Response){
        const {token, password, confirmPassword} = req.body;
        await this.authService.resetPassword(token, password, confirmPassword);
        return res.status(200).json({success:true, message:"Your password has been successfully reset!"})
    }
}