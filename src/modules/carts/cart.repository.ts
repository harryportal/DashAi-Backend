import { Cart, PaymentStatus, Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { BadRequestError } from "../../common/error";
import { AddGiftDto } from "./cart.dtos";

@injectable()
export default class CartRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    async createCart(userId:string):Promise<Cart>{
        return await this.prisma.cart.create({data: {user:{connect:{id:userId}}}});
    }

    async updateCart(cartId:string, gift:AddGiftDto):Promise<Cart | undefined>{
        return await this.prisma.cart.update({
            where: {id:cartId}, data: {gifts:{create:{gift: {connect: {id: gift.id}}, quantity:gift.quantity}}}})
    }

    async updateCartStatus(cartId:string, paymentId:string){
        await this.prisma.cart.update({
            where:{id:cartId}, data: {stripePaymentIntentId: paymentId, paymentStatus: PaymentStatus.PENDING}
        })
    }
    
    async getCart(cartId:string){
        return await this.prisma.cart.findUnique({
            where: {id:cartId}, include: {gifts:{include:{gift:true}}}});
    }
}