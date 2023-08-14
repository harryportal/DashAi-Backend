import { inject, injectable } from "inversify";
import { CartTypes } from "./cart.interface";
import CartRepository from "./cart.repository";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { AddGiftDto } from "./cart.dtos";

@injectable()
export default class CartController {
    constructor(@inject(CartTypes.CartRepository)private readonly repository: CartRepository){}

    createCart = async(req:AuthRequest, res:Response)=>{
        const {id} = await this.repository.createCart({user:{connect:{id:req.payload!.id}}});
        return res.status(201).json({success:true, data: {id}})
    }

    updateCart = async(req:AuthRequest, res:Response)=>{
        const id = req.params.id;
        const data = req.body as AddGiftDto;
        await this.repository.updateCart({id}, {gifts: {create:{gift: {connect: {id: data.id}}, quantity:data.quantity}}})
        return res.json({success:true})
    }
}