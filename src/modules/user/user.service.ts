import { inject, injectable } from "inversify";
import { Types, UserwithProfile } from "./user.interface";
import { Profile, Wishlist } from "@prisma/client";
import { BadRequestError,UnAuthorizedError } from "../../common/error";
import { AddProfileDto } from "./user.dtos";
import { UserRepository } from "./user.repository";


@injectable()
export class UserService{
    constructor(@inject(Types.UserRepository)private readonly userRepository:UserRepository){}

    /**
     * Fetches the wishlists belonging to the current user
     * @param id - user id
     */
    async getUserWishlist(id:string):Promise<Wishlist[] | null>{
        const wishlists = await this.userRepository.getUserWishlist({id});
        return wishlists;
    }

    /**
     * Verifies that the user's email address has been verified.
     * Adds and return the newly added profile.
     * @param profile 
     * @param id 
     * @returns the newly added profile
     */
    async addProfile(profile:AddProfileDto, id:string):Promise<Profile>{
        const user = await this.userRepository.getUser({id},{profile:true}) as UserwithProfile;
        if(user.profile){ throw new BadRequestError("User profile already exist!")};
        let addedProfile = await this.userRepository.addProfile({user:{connect:{id}},...profile});
        return addedProfile;
    }

}