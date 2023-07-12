import { inject, injectable } from "inversify";
import { IWishlistRepository, Types } from "./wishlist.interface";
import { AddWishlistDto } from "./wishlist.dtos";
import shortid from "shortid";

@injectable()
export class WishlistService{
    private readonly wishlistRepository:IWishlistRepository;
    constructor(@inject(Types.IWishlistRepository)repository:IWishlistRepository){
        this.wishlistRepository = repository;
    }

    async addWishlist(data:AddWishlistDto, userId:string){
        const {name, description} = data;
        const id = userId;
        const shortId = this.generateShortId();
        await this.wishlistRepository.addWishlist({name, shortId, description, user: {connect:{id}}})
    }

    /**
     * generates a short Id to be used for sharing the wishlist to friends and family
     * @returns shortId
     */
    private generateShortId(){
        const randomoString = shortid.generate();
        return `dash${randomoString}`
    }

    /**
     * Fetches the wishlist with the id or shortId
     * @param id 
     * @param shortId  
     */
    async getWishlist(id:string | undefined, shortId:string | undefined){
        const wishlist = this.wishlistRepository.getWishlist({id, shortId});
        return wishlist;
    }


}