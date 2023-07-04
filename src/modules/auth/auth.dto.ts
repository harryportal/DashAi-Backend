import { RefreshToken, User } from "@prisma/client";
import { Request } from "express";


export interface AuthRequest extends Request {
    user?: jwtPayload
}

export interface jwtPayload{
    id: string;
    email: string;
    refferalId:string
    activeStatus: boolean;
    firstname: string;
    lastname: string;
    type: string;
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
    verifyUser(userId: string): Promise<void>;
    createRefreshToken(refreshToken: string, expiresAt: Date, userId: string): Promise<void>;
    getRefreshToken(refreshToken: string): Promise<RefreshToken| null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
  }

export const AuthTypes = {
    IAuthRepository: Symbol("IAuthRepository")
}

export type UserProfile = Omit<User, 'password'>;
export type updateUser = Pick<User, "name" | "age" | "gender" | "location" >;