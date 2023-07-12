import { inject, injectable } from "inversify";
import { IWishlistService, Types } from "./wishlist.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddWishlistDto } from "./wishlist.dtos";


@injectable()
export class WishlistController {
    constructor(@inject(Types.IWishlistService)private readonly wishlistService:IWishlistService){}

    createWishlist = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const wishlistData = req.body as AddWishlistDto;
        await this.wishlistService.addWishlist(wishlistData, userId);
        return res.status(200).json({success:true, message:"Successfully created wishlist"})
    }

    getWishlist = async(req:AuthRequest, res:Response)=>{

    }
}