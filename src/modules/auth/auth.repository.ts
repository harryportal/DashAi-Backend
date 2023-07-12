import { Prisma, PrismaClient, RefreshToken, User } from "@prisma/client";
import { injectable, inject } from "inversify";
import { IAuthRepository } from "./auth.interface";


@injectable()
export default class AuthRepository implements IAuthRepository{
    private readonly user;
    private readonly refreshToken;
    constructor(@inject(PrismaClient)prisma:PrismaClient){
        this.user = prisma.user;
        this.refreshToken = prisma.refreshToken;
    }

    public async getUser(uniqueInput:Prisma.UserWhereUniqueInput):Promise<User | null>{
        const user = await this.user.findUnique({
            where: uniqueInput
        });
        return user;
    };

    public async updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>{
        const updatedUser = await this.user.update({
            where,
            data
        });
        return updatedUser;
    };

    public async createUser(data:Prisma.UserCreateInput):Promise<User>{
        const user = await this.user.create({
            data
        });
        return user;
    };

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