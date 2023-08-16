import {Profile, User} from "@prisma/client";

export interface UserwithProfile extends User {
    profile?: Profile
}
export type UserProfile = Omit<User, 'password' | "verificationToken">;

export const Types = {
    UserRepository:Symbol("UserRepository"),
    UserService:Symbol("UserService")
}