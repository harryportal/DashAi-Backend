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

    public async addUserProfile(userId:string, userData:Prisma.UserUpdateInput):Promise<User>{
        const {name, age, gender, location } = userData;
        const updatedUser = await this.user.update({
            where:{ id:userId},
            data: {name, age, gender, location, activeStatus:true}
        });
        return updatedUser;
    };

    public async addVerificationToken(id:string, token:string):Promise<void>{
        await this.user.update({
            where: { id },
            data:{
                verificationToken: token
            }
        });
    }


    public async resetPassword(userId:string, newPassword:string):Promise<void>{
        await this.user.update({
            where: { id: userId},
            data:{
                password: newPassword
            }
        });
    };

    public async deleteVerificationToken(email:string):Promise<void>{
        await this.user.update({
            where: { email },
            data:{
                verificationToken: null
            }
        });
    }

    public async createUser(email:string, password:string):Promise<User>{
        const user = await this.user.create({
            data:{
                email, password
            }
        });
        return user;
    };

    
    public async verifyUser(userId:string):Promise<void>{
        await this.user.update({
            where:{id:userId},
            data:{ verified: true }
        });
    };


    public async createRefreshToken(refreshToken:string, expiresAt:Date, userId:string):Promise<void>{
        await this.refreshToken.create({
           data:{
               expiresAt,
               token: refreshToken,
               user: {connect: {id:userId }}
           }
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