import { User } from "@prisma/client";
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

export interface IAuthRepository{
    getUser(id:string):Promise<User>
}
