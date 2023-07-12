import { Prisma, PrismaClient, User, Wishlist } from "@prisma/client";
import { inject, injectable } from "inversify";
import { IUserRepository } from "./user.interface";


@injectable()
export class UserRepository implements IUserRepository{
    private readonly user;
    constructor(@inject(PrismaClient)prisma:PrismaClient){
        this.user = prisma.user;
    }
    
    async getUser(uniqueInput:Prisma.UserWhereUniqueInput):Promise<User | null>{
        const user = await this.user.findUnique({
            where: uniqueInput
        });
        return user;
    };

    async updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>{
        const updatedUser = await this.user.update({
            where,
            data
        });
        return updatedUser;
    };

    async getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>{
        const userwithWishlist = await this.user.findUnique({
            where, select:{
                wishlists: true
            }
        });
        return userwithWishlist!.wishlists;
    }

    public async createUser(data:Prisma.UserCreateInput):Promise<User>{
        const user = await this.user.create({
            data
        });
        return user;
    };
}