import { Prisma, PrismaClient, Profile, User, Wishlist } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export class UserRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}
    
    async getUser(where:Prisma.UserWhereUniqueInput){
        return this.prisma.user.findUnique({
            where,
            select: {id:true, firstName:true, lastName:true, email:true, verified:true, password:true, profile:true}
        })
    };

    async getUserData(id:string){
        return this.prisma.user.findUnique({where: {id}})
    }

    async updateUser(where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput):Promise<User>{
        return this.prisma.user.update({
            where, data
        });
    }

    async updateProfile(where:Prisma.ProfileWhereUniqueInput, data:Prisma.ProfileUpdateInput):Promise<Profile>{
        return this.prisma.profile.update({
            where,
            data
        });
    };

    async addProfile(data:Prisma.ProfileCreateInput):Promise<Profile>{
        return this.prisma.profile.create({
            data
        });
    }

    async getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>{
        const userwithWishlist = await this.prisma.user.findUnique({
            where, select:{
                wishlists: true
            }
        });
        return userwithWishlist!.wishlists;
    }

    async createUser(data:Prisma.UserCreateInput):Promise<User>{
        return this.prisma.user.create({
            data
        });
    };

    async createFavourites(userId:string, giftId:string){
        await this.prisma.user.update({
            where: {id:userId},
            data: {favourites: {connect: {id: giftId}}}
        })
    };
    
    async getFavourites(userId:string){
        return this.prisma.user.findUnique({
            where: {id:userId}, 
            select: { favourites: true}
        })
    }
}