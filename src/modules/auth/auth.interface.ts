import { Prisma, RefreshToken, User } from "@prisma/client";
import { Request } from "express";
import { AddProfileDto } from "./auth.dtos";

export interface jwtPayload{
    id: string;
    email: string;
    type: string;
}

export interface AuthRequest extends Request {
    payload?:jwtPayload
}

export interface IAuthRepository {
    getUser(uniqueInput:Prisma.UserWhereUniqueInput): Promise<User | null>
    createUser(data:Prisma.UserCreateInput):Promise<User>;
    updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>
    createRefreshToken(data: Prisma.RefreshTokenCreateInput):Promise<void>
    getRefreshToken(refreshToken: string): Promise<RefreshToken| null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
}

export interface IAuthService {
  signUp(email: string, password: string): Promise<void>;
  verifyEmail(verificationToken: string): Promise<void>;
  signIn(email: string, password: string): Promise<ISignInResponse>;
  addProfile(profile: AddProfileDto, id: string): Promise<UserProfile>;
  getVerificationMail(email: string): Promise<void>;
  googleSignOn(user:User):Promise<ISignInResponse>
  resetPassword(token: string, password: string, confirmPassword: string): Promise<void>;
  getAccessToken(refreshToken: string): Promise<string>;
  deleteRefreshToken(refreshToken: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}

export const Types = {
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