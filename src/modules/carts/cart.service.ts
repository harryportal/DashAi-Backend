import { inject, injectable } from "inversify";
import { CartTypes, ICartCheckout } from "./cart.interface";
import CartRepository from "./cart.repository";
import { AddGiftDto } from "./cart.dtos";
import { BadRequestError } from "../../common/error";
import { Prisma } from "@prisma/client";
import { IPaymentService, PaymentTypes } from "../payment/payment.interface";


@injectable()
export default class CartService {
    constructor(@inject(CartTypes.CartRepo)private readonly repository:CartRepository,
    @inject(PaymentTypes.IPaymentService)private readonly paymentService:IPaymentService){}

    /**
     * create and return a user cart
     * @param userId 
     */
    async createCart(userId:string){
        const cart = await this.repository.createCart(userId);
        return cart;
    }
    
    async getCart(cartId:string){
        const cart = await this.repository.getCart(cartId);
        if(!cart){
            throw new BadRequestError("No Cart with the Id provided")
        }
        return cart;

    }
    /**
     * Update the cart and throw an error if the no cart with the Id exist
     * @param cartId 
     * @param gift 
     */
    async updateCart(cartId:string, gift:AddGiftDto){
        try {
            const cart = await this.repository.updateCart(cartId, gift)
            return cart;
        }catch(err:any){
            if (err instanceof Prisma.PrismaClientKnownRequestError){
                throw new BadRequestError(err.message)
        }}
    }


    /**
     * gets the cart checkout data from the cartId 
     * use the payment service to generate a checkout url
     * @param cartId 
     * @param userEmail 
     * @returns the checkout payment url
     */
    async getCheckoutUrl(cartId:string, userEmail:string){
        const checkOutData = await this.buildCartCheckoutData(cartId);
        const checkoutLink = await this.paymentService.createCheckoutLink(cartId,userEmail,checkOutData)
        return checkoutLink;
    }

    /**
     * Builds up the checkout data that will be used by stripe to display the products being paid for
     * @param cartId 
     * @returns cart checkout json array
     */
    async buildCartCheckoutData(cartId:string){
        let cartCheckoutInfo:ICartCheckout[] = [];
        const cart = await this.repository.getCart(cartId);
        if(!cart) { throw new BadRequestError("No cart with the given Id")};
        for(const cartGift of cart.gifts){
            const gift = cartGift.gift;
            cartCheckoutInfo.push({imageUrl:gift.imageUrl, name:gift.name,
            amount:gift.price as unknown as number, quantity: cartGift.quantity})
        }
        return cartCheckoutInfo;
    }


}