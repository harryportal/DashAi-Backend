import { Prisma, Profile, User, Wishlist } from "@prisma/client";
import { AddProfileDto } from "./user.dtos";

export interface IUserRepository {
    getUser(uniqueInput:Prisma.UserWhereUniqueInput, include?:Prisma.UserInclude): Promise<User | UserwithProfile | null>
    createUser(data:Prisma.UserCreateInput):Promise<User>;
    addProfile(data:Prisma.ProfileCreateInput):Promise<Profile>
    updateProfile(where:Prisma.ProfileWhereUniqueInput, data:Prisma.ProfileUpdateInput):Promise<Profile>
    updateUser(where:Prisma.UserWhereUniqueInput, data:Prisma.UserUpdateInput):Promise<User>
    getUserWishlist(where:Prisma.UserWhereUniqueInput):Promise<Wishlist[] | null>
}

export interface IUserService {
    getUserWishlist(id:string):Promise<Wishlist[] | null>;
    addProfile(profile:AddProfileDto, id:string):Promise<Profile>;
    getUserorThrow(userId:string):Promise<UserwithProfile>
}


export interface UserwithProfile extends User {
    profile?: Profile
}
export type UserProfile = Omit<User, 'password' | "verificationToken">;

export const Types = {
    IUserRepository:Symbol("IUserRepository"),
    IUserService:Symbol("IUserService")
}