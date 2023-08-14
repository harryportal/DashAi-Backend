import { IGiftCheckout } from "../gifts/gift.interface";

export interface IPaymentService {
    createCheckoutLink(orderId:string, customerEmail:string, giftDetails:IGiftCheckout[]):Promise<string>;
}


export const Types = {
    IPaymentService:Symbol("IPaymentService")
};