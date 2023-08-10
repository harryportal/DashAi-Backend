import { inject, injectable } from "inversify";
import Stripe from "stripe";
import logger from "../../utils/logging/winston";
import { BadRequestError } from "../../common/error";
import { IUserRepository, Types } from "../user/user.interface";


@injectable()
export default class StripeService {
    private stripe:Stripe;
    constructor(@inject(Types.IUserRepository)private readonly userRepository:IUserRepository,
        private readonly secretKey = process.env.STRIPE_SECRETKEY!, 
        private readonly signingKey = process.env.STRIPE_SIGNINGKEY!,
        ){
        this.stripe =  new Stripe(this.secretKey,
            {apiVersion: '2022-11-15',  maxNetworkRetries: 3,  timeout: 1000})
    }
    
    public retrieveIdFromSession = async(sessionId:string):Promise<string | null>=>{
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return session.client_reference_id;  // actually returns the listing Id
    }

    private getEvent = (payload:any, signature:string, signingKey:string):Stripe.Event=>{
        let event;
        try{
            event = this.stripe.webhooks.constructEvent(payload, signature, signingKey)
        }catch(err:any){
            logger.error("Stripe Webhook Failure", err.message);
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
    public createCheckOutSession = async(orderId:string, customerEmail:string):Promise<string>=>{
        try{
            const session = await this.stripe.checkout.sessions.create({
                client_reference_id: orderId,
                customer_email:customerEmail,
                mode: "payment",
                payment_intent_data:{  
                    // This will allow the customer to be charged only when the reciever claims the gift
                    capture_method:"manual"
                },
                success_url: process.env.HOMEPAGE_URL!,
                cancel_url:  process.env.HOMEPAGE_URL!
               }) 
            return session.url as string;
        }catch(error){
            throw new BadRequestError(`Failed to create a checkout session, ${error}`);
    }}

    /**
     * Creates a price and attach name(if they don't already exist) 
     * to a gift object -- will be referenced when creating the link for stripe checkout session
     * @param amount 
     * @param giftName 
     */
    private createPrice = async(amount:number, giftName:string)=>{
        await this. stripe.prices.create({
        unit_amount: 1999,
        currency: 'usd',
        recurring: {interval: 'month'},
        product_data: { name: giftName }
      });
    }
}