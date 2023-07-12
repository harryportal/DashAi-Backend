import { Prisma, User, Wishlist } from "@prisma/client";

export interface IUserRepository {
    getUser(uniqueInput:Prisma.UserWhereUniqueInput): Promise<User | null>
    createUser(data:Prisma.UserCreateInput):Promise<User>;
    updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>
    getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>
}

export interface IUserService {
    getUserWishlist(id:string):Promise<Wishlist[] | null>;
}

export const Types = {
    IUserRepository:Symbol("IUserRepository"),
    IUserService:Symbol("IUserService")
}