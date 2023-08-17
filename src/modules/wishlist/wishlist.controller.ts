import { inject, injectable } from "inversify";
import { Types } from "./wishlist.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddWishlistDto } from "./wishlist.dtos";
import { WishlistService } from "./wishlist.service";


@injectable()
export class WishlistController {
    constructor(@inject(Types.WishlistService)private readonly service:WishlistService){}

    createWishlist = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const wishlistData = req.body as AddWishlistDto;
        await this.service.addWishlist(wishlistData, userId);
        return res.status(201).json({success:true, message:"Successfully created wishlist"})
    }

    getWishlist = async(req:AuthRequest, res:Response)=>{
        const id = req.params.id;
        const wishlist = await this.service.getWishlist(id);
        return res.json({success:true, data:wishlist});
    }

    getWishlistwithUser = async(req:AuthRequest, res:Response)=>{
        const shortId = req.params.id;
        const wishlist = await this.service.getWishlist(shortId, true);
        return res.json({success:true, data:wishlist})
    }

    addGiftToWishlist = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const {giftId, wishlistId}= req.params;
        await this.service.addGiftToWishlist(userId, wishlistId, giftId);
        return res.json({success:true});
    }
}