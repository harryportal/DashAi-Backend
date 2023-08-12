import { IGiftCheckout } from "../gifts/gift.interface";

export interface IPaymentService {
    createCheckoutLink(orderId:string, customerEmail:string, giftDetails:IGiftCheckout[]):Promise<string>;
}


export const PTypes = {
    IPaymentService:Symbol("IPaymentService")
};