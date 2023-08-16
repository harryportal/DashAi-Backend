import { Response } from "express";
import { AuthRequest} from "../auth/auth.interface";
import { inject, injectable } from "inversify";
import { IPaymentService, PaymentTypes } from "./payment.interface";

@injectable()
export default class PaymentController {
    constructor(@inject(PaymentTypes.IPaymentService)private readonly service:IPaymentService){}

    public webhookHandler = async(req:AuthRequest, res:Response)=>{
        let payload = req.body as Buffer;
        const signature = req.headers['stripe-signature'] as string;
        await this.service.handleWebhook(payload, signature)
        return res.status(200).json({success:true})
    }


}
