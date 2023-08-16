import {Profile, User} from "@prisma/client";

export interface UserwithProfile extends Omit<User, "verificationToken" | "googleSignOn"> {
    profile?: Profile
}

export type UserProfile = Omit<User, 'password' | "verificationToken">;

export const Types = {
    UserRepository:Symbol("UserRepository"),
    UserService:Symbol("UserService")
}