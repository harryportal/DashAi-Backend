import { inject, injectable } from "inversify";
import { IUserRepository, IUserService, Types, UserProfile } from "./user.interface";
import { Wishlist } from "@prisma/client";
import { ForbiddenError, UnAuthorizedError } from "../../common/error";
import { AddProfileDto } from "./user.dtos";


@injectable()
export class UserService implements IUserService {
    constructor(@inject(Types.IUserRepository)private readonly userRepository:IUserRepository){}

    /**
     * Fetches the wishlists belonging to the current user
     * @param id - user id
     */
    async getUserWishlist(id:string):Promise<Wishlist[] | null>{
        const wishlists = await this.userRepository.getUserWishlist({id});
        return wishlists;
    }

    /**
     * Verifies that a user with the id exists.
     * Verifies that the user's email address has been verified.
     * Adds and return the newly added profile.
     * @param profile 
     * @param id 
     * @returns the newly added profile
     */
    public async addProfile(profile:AddProfileDto, id:string):Promise<UserProfile>{
        const user = await this.userRepository.getUser({id});
        if(!user){ throw new UnAuthorizedError("No user with Provided with Credentials") };
        if(!user.verified) { throw new ForbiddenError("Please verify your email address to Continue")}
        let addedProfile = await this.userRepository.updateUser({id}, {...profile});
        const {password, verificationToken, ...newProfile} = addedProfile;
        return newProfile;
    }
}