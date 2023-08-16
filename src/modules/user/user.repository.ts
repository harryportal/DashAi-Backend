import { Prisma, PrismaClient, Profile, User, Wishlist } from "@prisma/client";
import { inject, injectable } from "inversify";
import { UserwithProfile } from "./user.interface";


@injectable()
export class UserRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}
    
    async getUser(where:Prisma.UserWhereUniqueInput){
        const user = await this.prisma.user.findUnique({
            where,
            select: {id:true, firstName:true, lastName:true, email:true, verified:true, password:true, profile:true}
        })
        return user;
    };

    async getUserData(id:string){
        return await this.prisma.user.findUnique({where: {id}})
    }

    async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput):Promise<User>{
         const user = await this.prisma.user.update({
            where, data
        });
        return user;
    }

    async updateProfile(where:Prisma.ProfileWhereUniqueInput, data:Prisma.ProfileUpdateInput):Promise<Profile>{
        const updatedUser = await this.prisma.profile.update({
            where,
            data
        });
        return updatedUser;
    };

    async addProfile(data:Prisma.ProfileCreateInput):Promise<Profile>{
        const profile = await this.prisma.profile.create({
            data
        });
        return profile;
    }

    async getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>{
        const userwithWishlist = await this.prisma.user.findUnique({
            where, select:{
                wishlists: true
            }
        });
        return userwithWishlist!.wishlists;
    }

    public async createUser(data:Prisma.UserCreateInput):Promise<User>{
        const user = await this.prisma.user.create({
            data
        });
        return user;
    };
}