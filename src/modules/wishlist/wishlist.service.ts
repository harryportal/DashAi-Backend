import { inject, injectable } from "inversify";
import { Types } from "./wishlist.interface";
import { AddWishlistDto } from "./wishlist.dtos";
import shortid from "shortid";
import { Wishlist } from "@prisma/client";
import { WishlistRepository } from "./wishlist.repository";
import { BadRequestError } from "../../common/error";

@injectable()
export class WishlistService{
    constructor(@inject(Types.WishlistRepository)private readonly repository:WishlistRepository){}

    async addWishlist(data:AddWishlistDto, userId:string):Promise<void>{
        const {name, description} = data;
        const id = userId;
        const shortId = this.generateShortId();
        await this.repository.addWishlist({name, shortId, description, user: {connect:{id}}})
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
            wishlist = await this.repository.getWishlist({shortId:id}, 
                {user:{select:{firstName:true, lastName:true}}, gifts:true})
        }else{
            wishlist = await this.repository.getWishlist({id}, {gifts:true});
        }
        return wishlist;
    }
    /**
     * Verifies that the wishlist belong to the user
     * Add the gift to the user's wishlist
     * @param wishlistId 
     * @param giftId 
     */
    async addGiftToWishlist(userId:string, wishlistId:string, giftId:string){
        const wishlist = await this.repository.getWishlist({id:wishlistId});
        if(!wishlist || wishlist.userId != userId){
            throw new BadRequestError("Invalid Wishlist or Wishlist does not belong to current User")
        }
        try {
            await this.repository.updateWishlist({id:wishlistId}, {gifts: {connect: {id:giftId}}})
        } catch(err:any){
            throw new BadRequestError("Invalid Gift Id Provided")
        }}


}