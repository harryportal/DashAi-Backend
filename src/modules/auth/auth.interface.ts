import { RefreshToken, User } from "@prisma/client";
import { Request } from "express";

export interface jwtPayload{
    id: string;
    email: string;
    type: string;
}

export interface AuthRequest extends Request {
    payload?:jwtPayload
}

export interface ISignIn {
    email: string
    password:string
}


export interface IAuthRepository {
    getUserwithId(userId: string): Promise<User | null>;
    getUserwithEmail(email: string): Promise<User | null>;
    addUserProfile(userId: string, userData: Partial<updateUser>): Promise<User>;
    resetPassword(userId: string, newPassword: string): Promise<void>;
    createUser(email: string, password: string): Promise<User>;
    addVerificationToken(id:string, token:string):Promise<void>
    verifyUser(userId: string): Promise<void>;
    deleteVerificationToken(email:string):Promise<void>;
    createRefreshToken(refreshToken: string, expiresAt: Date, userId: string): Promise<void>;
    getRefreshToken(refreshToken: string): Promise<RefreshToken| null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
}

export interface IAuthService {
  signUp(email: string, password: string): Promise<void>;
  verifyEmail(verificationToken: string): Promise<void>;
  signIn(email: string, password: string): Promise<ISignInResponse>;
  addProfile(profile: updateUser, id: string): Promise<UserProfile>;
  getVerificationMail(email: string): Promise<void>;
  googleSignOn(user:User):Promise<ISignInResponse>
  resetPassword(token: string, password: string, confirmPassword: string): Promise<void>;
  getAccessToken(refreshToken: string): Promise<string>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}

export const AuthTypes = {
    IAuthRepository: Symbol("IAuthRepository"),
    IAuthService: Symbol("IAuthService")
}

export interface ISignInResponse{
    refreshToken:string,
    accessToken:string,
    onboardingStatus:boolean,
    verificationStatus:boolean,
}
export interface IToken extends Pick<ISignInResponse, "accessToken"|"refreshToken">{};
export type UserProfile = Omit<User, 'password' | "verificationToken">;
export type updateUser = Pick<User, "name" | "age" | "gender" | "location" >;