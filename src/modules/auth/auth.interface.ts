import { Prisma, RefreshToken, User } from "@prisma/client";
import { Request } from "express";

export interface jwtPayload{
    id: string;
    email: string;
    type: string;
}

export interface AuthRequest extends Request {
    payload?:jwtPayload
}

export interface IAuthRepository {
    createRefreshToken(data: Prisma.RefreshTokenCreateInput):Promise<void>
    getRefreshToken(refreshToken: string): Promise<RefreshToken| null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
}

export interface IAuthService {
  signUp(email: string, password: string): Promise<void>;
  verifyEmail(verificationToken: string): Promise<void>;
  signIn(email: string, password: string): Promise<ISignInResponse>;
  getVerificationMail(email: string): Promise<void>;
  googleSignOn(user:User):Promise<ISignInResponse>
  resetPassword(token: string, password: string, confirmPassword: string): Promise<void>;
  getAccessToken(refreshToken: string): Promise<string>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}

export const Types = {
    IAuthService: Symbol("IAuthService"),
    IAuthRepository:Symbol("IAuthRepository")
}

export interface ISignInResponse{
    refreshToken:string,
    accessToken:string,
    onboardingStatus:boolean,
    verificationStatus:boolean,
}

export interface IToken extends Pick<ISignInResponse, "accessToken"|"refreshToken">{};
