import { inject, injectable } from "inversify";
import Stripe from "stripe";
import logger from "../../utils/logging/winston";
import { BadRequestError } from "../../common/error";
import { IGiftCheckout } from "../gifts/gift.interface";
import { IPaymentService } from "./payment.interface";
import CartRepository from "../carts/cart.repository";
import { CartTypes } from "../carts/cart.interface";

@injectable()
export default class StripeService implements IPaymentService{
    private stripe:Stripe;
    constructor(@inject(CartTypes.CartRepo)private readonly cartRepository:CartRepository,
        private readonly secretKey = process.env.STRIPE_SECRETKEY!, 
        private readonly signingKey = process.env.STRIPE_SIGNINGKEY!,
        ){
        this.stripe =  new Stripe(this.secretKey,
            {apiVersion: '2022-11-15',  maxNetworkRetries: 3,  timeout: 1000})
    }
    
    public async handleWebhook(payload:any, signature:string):Promise<void>{
        const event = this.getEvent(payload, signature, this.signingKey)
        switch(event.type){
            case "checkout.session.completed":
                await this.handleChargeSucceeded(event);
                
        }
    }

    private async handleChargeSucceeded(event:Stripe.Event){
        const session = event.data.object as Stripe.Checkout.Session;
        const cartId = session.client_reference_id as string;
        console.log(cartId)
        const paymentId = session.payment_intent as string;
        await this.cartRepository.updateCartStatus(cartId, paymentId)
    }

    private getEvent(payload:any, signature:string, signingKey:string):Stripe.Event{
        let event;
        try{
            event = this.stripe.webhooks.constructEvent(payload, signature, signingKey)
        }catch(err:any){
            logger.error("Stripe Webhook Failure", err);
            throw new BadRequestError(`WebHook Error ${err.message}`)
        }
        return event;
    }
    /**
     * Creates a checkout link for customer to pay a one-time for gift purchase/giftings
     * @param orderId 
     * @param customerEmail 
     * @returns stripe checkout link
     */
    public async createCheckoutLink(cartId:string, customerEmail:string, giftDetails:IGiftCheckout[]):Promise<string>{
        try {
            console.log(giftDetails);
            const session = await this.stripe.checkout.sessions.create({
                client_reference_id: cartId,
                customer_email: customerEmail,
                line_items: giftDetails.map(item => ({
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: item.name,
                            images: [item.imageUrl],
                        },
                        unit_amount:parseFloat((item.amount * 100).toFixed(2)) // converts amount to cents
                    },
                    quantity: item.quantity,
                })),
                mode: "payment",
                payment_intent_data: {
                    capture_method: "manual",
                },
                success_url: process.env.FRONTENDURL!,
                cancel_url: process.env.FRONTENDURL!,
            });
        
            return session.url as string;
        } catch (error) {
            logger.error(`Failed to create a checkout session, ${error}`)
            throw new BadRequestError(`Failed to create a checkout session, ${error}`);
        }
    }

}