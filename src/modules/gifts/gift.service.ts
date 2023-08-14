import { inject, injectable } from "inversify";
import { GiftsDto, SendGiftsDto } from "./gift.dtos";
import { IGiftCheckout, IGiftRepository, Types } from "./gift.interface";
import { BadRequestError } from "../../common/error";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";
import { sendGiftTemplate } from "../../utils/mailTemplates/sendGift";
import { IPaymentService, Types as PaymentTypes } from "../payment/payment.interface";
import { IUserService, Types as UserTypes } from "../user/user.interface";
import { Gift } from "@prisma/client";

@injectable()
export default class GiftService {
    constructor(@inject(Types.IGiftRepository)private readonly giftRepository:IGiftRepository,
    @inject(MailTypes.IEmailQueue)private readonly mailService:IEmailQueue,
    @inject(UserTypes.IUserService)private readonly userService:IUserService,
    @inject(PaymentTypes.IPaymentService)private readonly paymentService:IPaymentService){}

    /**
     * Build up the gift data required for checkout
     * Get checkout link and return to the client
     * @param data 
     * @param userId 
     */
    async sendGift(data:SendGiftsDto, userId:string):Promise<void>{
        const giftCheckoutInfo = this.validateandReturnGifts(data.gifts);
        const giftUrl = `${process.env.FRONTENDURL}/claim-gift/`;
        const user = await this.userService.getUserorThrow(userId);
        const {recipientEmail, recipientName, message} = data;

        if(user.email == recipientEmail){
            throw new BadRequestError("Sending gifts to yourself feature will be released soon!😃")
        }

        const sendgiftTemplate = sendGiftTemplate(giftUrl, user.lastName, message, recipientName)
        await this.mailService.addEmailToQueue({to:recipientEmail, subject: "You've been dashed a new Gift", html:sendgiftTemplate})
    }

    /**
     * Validates that all the gifts Ide exists in the database and throws an error for any invalid id
     * todo: Validate the amount making sure that amount is valid (depends on the structure of the external service
     * implemented)
     * Build up the data for stripe checkout logic
     * @param giftsDto 
     */
    private async validateandReturnGifts(giftsDto:GiftsDto[]):Promise<IGiftCheckout[]>{
        let giftCheckoutInfo:IGiftCheckout[] = [];
        for (const gift of giftsDto){
            const giftData = await this.giftRepository.getGift({id:gift.id}) as Gift;
            if (!giftData){
                throw new BadRequestError("Gift does not exist for the Id provided!")
            }
            giftCheckoutInfo.push({imageUrl:giftData.imageUrl, name:giftData.name,
            amount:giftData.price as unknown as number, quantity: gift.quantity})
        }
        return giftCheckoutInfo;
    }
}