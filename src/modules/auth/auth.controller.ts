import { inject, injectable } from "inversify";
import { AuthRequest, Types, IAuthService } from "./auth.interface";
import { Request, Response } from "express";
import { User } from "@prisma/client";
import { AddProfileDto } from "./auth.dtos";

@injectable()
export class AuthController {
    private readonly authService:IAuthService;
    constructor(@inject(Types.IAuthService)service:IAuthService){
        this.authService = service;
    }

    public signUp = async(req:Request, res:Response)=>{
        const {email, password} = req.body;
        await this.authService.signUp(email, password);
        return res.status(201).json({success:true, message:"A verification link has been sent to your email address!"})
    }

    public signIn = async(req:Request, res:Response)=>{
        const {email, password} = req.body;
        const data = await this.authService.signIn(email, password);
        return res.status(200).json({success:true, data});
    }

    public googleSignOn = async(req:Request, res:Response)=>{
        const user = req.user as User;
        const response = await this.authService.googleSignOn(user);
        res.status(200).json({success:true, data:response}) // change implementation to redirect to frontend url
    }

    public addProfile = async(req:AuthRequest, res:Response)=>{
        const profileData = req.body as AddProfileDto;
        const userId = req.payload!.id;
        const updatedProfile = await this.authService.addProfile(profileData, userId);
        return res.status(200).json({success:true, data:updatedProfile})
    }

    public getVerficiationMail = async(req:AuthRequest, res:Response)=>{
        const email = req.payload!.email;
        await this.authService.getVerificationMail(email);
        return res.status(200).json({success:true, message:"A verification link has been sent to your email address!"})
    }

    public logout = async(req:Request, res:Response)=>{
        const refreshToken = req.query.token as string;
        await this.authService.deleteRefreshToken(refreshToken);
        return res.status(200).json({success:true, message:"Logout Successful"})
    }

    public forgotPassword = async(req:Request, res:Response)=>{
        const {email} = req.body;
        await this.authService.forgotPassword(email);
        return res.status(200).json({success:true, message:"A password reset link has been sent to your mail"})
    }

    public resetPassword = async(req:Request, res:Response)=>{
        const {token, password, confirmPassword} = req.body;
        await this.authService.resetPassword(token, password, confirmPassword);
        return res.status(200).json({success:true, message:"Your password has been successfully reset!"})
    }

    public verifyEmail = async(req:Request, res:Response)=>{
        const token = req.query.token as string;
        await this.authService.verifyEmail(token)
        return res.status(200).json({success:true, message:"Your Email has been verified!"})
    }   
}