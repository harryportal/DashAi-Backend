import { inject, injectable } from "inversify";
import { Types } from "./user.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddProfileDto } from "./user.dtos";
import { UserService } from "./user.service";

@injectable()
export default class UserController {
    constructor(@inject(Types.UserService)private readonly service:UserService){}

    getWishlist = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const wishlists = await this.service.getUserWishlist(id);
        return res.json({success:true, data:wishlists});
    }

    onBoardUser = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const userData = req.body as AddProfileDto;
        const profile = await this.service.addProfile(userData, id);
        return res.status(201).json({success:true, data:profile})
    }

    getProfile = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const profile = await this.service.getProfile(id);
        return res.json({success:true, data:profile})
    }
    
    addToFavourites = async(req:AuthRequest, res:Response)=>{
        const giftId = req.params.giftId;
        const userId = req.payload!.id;
        await this.service.addToFavourites(giftId, userId);
        return res.status(201).json({success:true});
    }

    getFavourites = async(req:AuthRequest, res:Response)=>{
        const userId = req.payload!.id;
        const favourites = await this.service.getFavourites(userId);
        return res.json({success:true, data:favourites})
    }


    
}