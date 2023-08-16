import { inject, injectable } from "inversify";
import { CartTypes } from "./cart.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import CartService from "./cart.service";
import { AddGiftDto } from "./cart.dtos";

@injectable()
export default class CartController {
    constructor(@inject(CartTypes.CartService)private readonly service:CartService){}

    createCart = async(req:AuthRequest, res:Response)=>{
        const cart = await this.service.createCart(req.payload!.id);
        return res.status(201).json({success:true, data:cart})
    }

    updateCart = async(req:AuthRequest, res:Response)=>{
        const cartId = req.params.id;
        await this.service.updateCart(cartId, req.body as AddGiftDto);
        return res.json({success:true})
    }
    
    getCart = async(req:AuthRequest, res:Response)=>{
        const cartId = req.params.id;
        const cart = await this.service.getCart(cartId);
        return res.json({success:true, data:cart})

    }
    getCartCheckoutLink = async(req:AuthRequest, res:Response)=>{
        const email = req.payload!.email;
        const cartId = req.params.id;
        const checkoutUrl = await this.service.getCheckoutUrl(cartId, email);
        res.json({success:true, checkoutUrl})
    }
}