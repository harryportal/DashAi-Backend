import { Response } from "express";
import { AuthRequest, jwtPayload } from "../auth/auth.interface";
import { IPaymentService, PTypes } from "./payment.interface";
import { inject, injectable } from "inversify";

@injectable()
export default class PaymentController {
    constructor(@inject(PTypes.IPaymentService)private readonly paymentService:IPaymentService){}
    

    public createCheckoutSession = async(req:AuthRequest, res:Response)=>{
        let {email} = req.payload as jwtPayload;

        //const checkouturl = await this.paymentService.createCheckoutLink(email);
        //res.status(200).json({success:true, data: checkouturl})
    }
}
