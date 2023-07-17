import { Prisma, PrismaClient, RefreshToken, User } from "@prisma/client";
import { injectable, inject } from "inversify";
import { IAuthRepository } from "./auth.interface";


@injectable()
export default class AuthRepository implements IAuthRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    public async createRefreshToken(data: Prisma.RefreshTokenCreateInput):Promise<void>{
        await this.prisma.refreshToken.create({
           data
       });
    };
    
    public async getRefreshToken(refreshToken:string):Promise<RefreshToken | null>{
        const token = await this.prisma.refreshToken.findUnique({ where: {  token: refreshToken } });
        return token;
    };

    public async deleteRefreshToken(refreshToken:string):Promise<void>{
        await this.prisma.refreshToken.delete({ where: { token: refreshToken } });        
    };
    
}