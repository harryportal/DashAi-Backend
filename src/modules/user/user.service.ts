import { inject, injectable } from "inversify";
import { IUserRepository, IUserService, Types } from "./user.interface";
import { Wishlist } from "@prisma/client";


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
}