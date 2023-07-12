import { inject, injectable } from "inversify";
import { IUserService, Types } from "./user.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";

@injectable()
export default class UserController {
    constructor(@inject(Types.IUserService)private readonly userService:IUserService){}

    getUserWishlist = async(req:AuthRequest, res:Response)=>{
        const id = req.payload!.id;
        const wishlists = await this.userService.getUserWishlist(id);
        return res.status(200).json({success:true, data:wishlists});
    }
}