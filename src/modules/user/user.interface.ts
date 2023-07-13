import { Prisma, User, Wishlist } from "@prisma/client";
import { AddProfileDto } from "./user.dtos";

export interface IUserRepository {
    getUser(uniqueInput:Prisma.UserWhereUniqueInput): Promise<User | null>
    createUser(data:Prisma.UserCreateInput):Promise<User>;
    updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>
    getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>
}

export interface IUserService {
    getUserWishlist(id:string):Promise<Wishlist[] | null>;
    addProfile(profile:AddProfileDto, id:string):Promise<UserProfile>
}


export type UserProfile = Omit<User, 'password' | "verificationToken">;

export const Types = {
    IUserRepository:Symbol("IUserRepository"),
    IUserService:Symbol("IUserService")
}