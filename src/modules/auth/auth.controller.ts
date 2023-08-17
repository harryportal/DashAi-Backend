import { inject, injectable } from "inversify";
import { AuthRequest, Types } from "./auth.interface";
import { Request, Response } from "express";
import { UserwithProfile } from "../user/user.interface";
import { SignInDto, SignUpDto } from "./auth.dtos";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
    constructor(@inject(Types.AuthService)private readonly authService:AuthService){}

    signUp = async(req:Request, res:Response)=>{
        const userInfo = req.body as SignUpDto;
        await this.authService.signUp(userInfo);
        return res.status(201).json({success:true, message:"A verification link has been sent to your email address!"})
    }

    signIn = async(req:Request, res:Response)=>{
        const {email, password} = req.body as SignInDto;
        const data = await this.authService.signIn(email, password);
        return res.json({success:true, data});
    }

    googleSignOn = async(req:Request, res:Response)=>{
        const user = req.user as UserwithProfile;
        const response = await this.authService.googleSignOn(user);
        res.json({success:true, data:response}) // change implementation to redirect to frontend url
    }

    getVerficiationMail = async(req:AuthRequest, res:Response)=>{
        const email = req.payload!.email;
        await this.authService.getVerificationMail(email);
        return res.json({success:true, message:"A verification link has been sent to your email address!"})
    }
    
    getVerficiationMailwithEmail = async(req:Request, res:Response)=>{
        const email = req.body.email;
        await this.authService.getVerificationMail(email);
        return res.json({success:true, message:"A verification link has been sent to your email address!"})
    }

    logout = async(req:Request, res:Response)=>{
        const refreshToken = req.query.token as string;
        await this.authService.deleteRefreshToken(refreshToken);
        return res.json({success:true, message:"Logout Successful"})
    }

    forgotPassword = async(req:Request, res:Response)=>{
        const {email} = req.body;
        await this.authService.forgotPassword(email);
        return res.json({success:true, message:"A password reset link has been sent to your mail"})
    }

    resetPassword = async(req:Request, res:Response)=>{
        const {token, password, confirmPassword} = req.body;
        await this.authService.resetPassword(token, password, confirmPassword);
        return res.json({success:true, message:"Your password has been successfully reset!"})
    }

    getAccessToken = async(req:Request, res:Response)=>{
        const refreshToken = req.query.token as string;
        const accessToken = await this.authService.getAccessToken(refreshToken);
        return res.json({success:true, data: {accessToken}})
    }

    verifyEmail = async(req:Request, res:Response)=>{
        const token = req.query.token as string;
        const redirectLink = await this.authService.verifyEmail(token)
        return res.redirect(redirectLink)
    }   
}