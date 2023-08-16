import { inject, injectable } from "inversify";
import { GiftsDto, SendGiftsDto } from "./gift.dtos";
import { IGiftCheckout, Types } from "./gift.interface";
import { BadRequestError } from "../../common/error";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";
import { sendGiftTemplate } from "../../utils/mailTemplates/sendGift";
import { IPaymentService, PaymentTypes } from "../payment/payment.interface";
import { Types as UserTypes } from "../user/user.interface";
import { OrderTypes } from "../orders/order.interface";
import { Gift } from "@prisma/client";
import OrderRepository from "../orders/order.repository";
import GiftRepository from "./gift.repository";
import { UserService } from "../user/user.service";

@injectable()
export default class GiftService {
    constructor(@inject(Types.GiftRepository)private readonly giftRepository:GiftRepository,
    @inject(MailTypes.IEmailQueue)private readonly mailService:IEmailQueue,
    @inject(UserTypes.UserService)private readonly userService:UserService,
    @inject(OrderTypes.OrderRepository)private readonly orderRepository:OrderRepository,
    @inject(PaymentTypes.IPaymentService)private readonly paymentService:IPaymentService){}

    /**
     * Build up the gift data required for checkout
     * Get checkout link and return to the client
     * @param data 
     * @param userId 
     */
    async getCheckoutLink(data:SendGiftsDto,  cartId:string, userEmail:string){

        // const giftUrl = `${process.env.FRONTENDURL}/claim-gift/`;
        // const user = await this.userService.getUserorThrow(userId);
        // const {recipientEmail, recipientName, message} = data;  

        // if(user.email == recipientEmail){
        //     throw new BadRequestError("Sending gifts to yourself feature will be released soon!😃")
        // }

        // const sendgiftTemplate = sendGiftTemplate(giftUrl, user.lastName, message, recipientName)
        // await this.mailService.addEmailToQueue({to:recipientEmail, subject: "You've been dashed a new Gift", html:sendgiftTemplate})
    
}}