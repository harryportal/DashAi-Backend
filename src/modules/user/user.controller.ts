import { inject, injectable } from "inversify";
import { Types } from "./user.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddProfileDto } from "./user.dtos";
import { UserService } from "./user.service";

@injectable()
export default class UserController {
    constructor(@inject(Types.UserService)private readonly service:UserService){}

    getUserWishlist = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const wishlists = await this.service.getUserWishlist(id);
        return res.status(200).json({success:true, data:wishlists});
    }

    onBoardUser = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const userData = req.body as AddProfileDto;
        const profile = await this.service.addProfile(userData, id);
        return res.status(200).json({success:true, data:profile})
    }

    getProfile = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const profile = await this.service.getProfile(id);
        return res.status(200).json({success:true, data:profile})
    }

    
}