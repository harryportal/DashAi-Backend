import { inject, injectable } from "inversify";
import { Types } from "./user.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddProfileDto } from "./user.dtos";
import { UserService } from "./user.service";

@injectable()
export default class UserController {
    constructor(@inject(Types.UserService)private readonly userService:UserService){}

    getUserWishlist = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const wishlists = await this.userService.getUserWishlist(id);
        return res.status(200).json({success:true, data:wishlists});
    }

    onBoardUser = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const userData = req.body as AddProfileDto;
        const profile = await this.userService.addProfile(userData, id);
        return res.status(200).json({success:true, data:profile})
    }
    
}