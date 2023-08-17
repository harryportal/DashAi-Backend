import { inject, injectable } from "inversify";
import { Types, UserwithProfile } from "./user.interface";
import { Profile, User, Wishlist } from "@prisma/client";
import { BadRequestError,UnAuthorizedError } from "../../common/error";
import { AddProfileDto } from "./user.dtos";
import { UserRepository } from "./user.repository";


@injectable()
export class UserService{
    constructor(@inject(Types.UserRepository)private readonly repository:UserRepository){}

    /**
     * Fetches the wishlists belonging to the current user
     * @param id - user id
     */
    async getUserWishlist(id:string):Promise<Wishlist[] | null>{
        return this.repository.getUserWishlist({id});
    }

    /**
     * Verifies that the user's email address has been verified.
     * Adds and return the newly added profile.
     * @param profile 
     * @param id 
     * @returns the newly added profile
     */
    async addProfile(profile:AddProfileDto, id:string):Promise<Profile>{
        const user = await this.repository.getUser({id}) as UserwithProfile;
        if(user.profile){ throw new BadRequestError("User profile already exist!")};
        let addedProfile = await this.repository.addProfile({user:{connect:{id}},...profile});
        return addedProfile;
    }

    /**
     * Get and return the user with profile details
     * @param userId 
     * @returns the user profile with password excluded
     */
    async getProfile(userId:string){
        const user = await this.repository.getUser({id:userId}) as UserwithProfile;
        const {password, ...userData} = user;
        return userData;
    }
    /**
     * Add a gift to the user favourites
     * @param giftId 
     * @param userId
     */
    async addToFavourites(giftId:string, userId:string){
        await this.repository.createFavourites(userId, giftId);
    }

    /**
     * This returns the user favourite gifts
     * @param userId 
     */
    async getFavourites(userId:string){
        return this.repository.getFavourites(userId)
    }



}