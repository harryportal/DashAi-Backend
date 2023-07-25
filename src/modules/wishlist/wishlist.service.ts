import { inject, injectable } from "inversify";
import { IWishlistRepository, IWishlistService, Types } from "./wishlist.interface";
import { AddWishlistDto } from "./wishlist.dtos";
import shortid from "shortid";
import { Wishlist } from "@prisma/client";

@injectable()
export class WishlistService implements IWishlistService{
    private readonly wishlistRepository:IWishlistRepository;
    constructor(@inject(Types.IWishlistRepository)repository:IWishlistRepository){
        this.wishlistRepository = repository;
    }

    async addWishlist(data:AddWishlistDto, userId:string):Promise<void>{
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
    async getWishlist(id:string, includeUser?:boolean ):Promise<Wishlist | null>{
        let wishlist;
        if(includeUser){
            wishlist = await this.wishlistRepository.getWishlist({shortId:id}, 
                {user:{select:{profile:{select:{name:true}}}}})
        }else{
            wishlist = await this.wishlistRepository.getWishlist({id});
        }
        return wishlist;
    }


}