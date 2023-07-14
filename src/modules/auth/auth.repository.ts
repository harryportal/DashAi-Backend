import { Prisma, PrismaClient, RefreshToken, User } from "@prisma/client";
import { injectable, inject } from "inversify";
import { IAuthRepository } from "./auth.interface";


@injectable()
export default class AuthRepository implements IAuthRepository{
    private readonly refreshToken;
    constructor(@inject(PrismaClient)prisma:PrismaClient){
        this.refreshToken = prisma.refreshToken;
    }

    public async createRefreshToken(data: Prisma.RefreshTokenCreateInput):Promise<void>{
        await this.refreshToken.create({
           data
       });
    };
    
    public async getRefreshToken(refreshToken:string):Promise<RefreshToken | null>{
        const token = await this.refreshToken.findUnique({ where: {  token: refreshToken } });
        return token;
    };

    public async deleteRefreshToken(refreshToken:string):Promise<void>{
        await this.refreshToken.delete({ where: { token: refreshToken } });        
    };
    
}