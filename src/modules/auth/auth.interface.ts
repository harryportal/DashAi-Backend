import { Prisma, RefreshToken, User } from "@prisma/client";
import { Request } from "express";
import { SignUpDto } from "./auth.dtos";
import { UserwithProfile } from "../user/user.interface";

export interface jwtPayload{
    id: string;
    email: string;
    type: string;
}

export interface AuthRequest extends Request {
    payload?:jwtPayload
}

export const Types = {
    AuthService: Symbol("AuthService"),
    AuthRepository:Symbol("AuthRepository")
}

export interface ISignInResponse{
    refreshToken:string,
    accessToken:string,
    user: Omit<UserwithProfile, "password">
}

export interface IToken extends Pick<ISignInResponse, "accessToken"|"refreshToken">{};
