import { IGiftCheckout } from "../gifts/gift.interface";

export interface IPaymentService {
    createCheckoutLink(orderId:string, customerEmail:string, giftDetails:IGiftCheckout[]):Promise<string>;
    handleWebhook(payload:Buffer, signature:string):Promise<void>
}


export const PaymentTypes = {
    IPaymentService:Symbol("IPaymentService")
};