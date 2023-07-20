import { inject, injectable } from "inversify";
import { SendGiftsDto } from "./gift.dtos";
import { IGiftRepository, Types } from "./gift.interface";
import { BadRequestError } from "../../common/error";
import { IEmailQueue, MailTypes } from "../mail/mail.interface";
import { sendGiftTemplate } from "../../utils/mailTemplates/sendGift";
import { IUserRepository, IUserService, Types as UserTypes } from "../user/user.interface";

@injectable()
export default class GiftService {
    constructor(@inject(Types.IGiftRepository)private readonly giftRepository:IGiftRepository,
    @inject(MailTypes.IEmailQueue)private readonly mailService:IEmailQueue,
    @inject(UserTypes.IUserService)private readonly userService:IUserService){}

    /**
     * Check if a gift with that Id exists
     * Get the sender name from user Id
     * Build up a mail from the name, email and description the customer provided
     * @param giftId 
     * @param data 
     */
    async sendGift(giftId:string, data:SendGiftsDto, userId:string):Promise<void>{
        const gift = await this.giftRepository.getGift({id:giftId})
        if(!gift){
            throw new BadRequestError("No Gift with Id Provided")
        }
        const giftUrl = `${process.env.FRONTENDURL}/claim-gift/`;
        const user = await this.userService.getUserorThrow(userId);
        const {recipientEmail, recipientName, message} = data;
        const sendgiftTemplate = sendGiftTemplate(giftUrl, user.profile!.name,message, recipientName)
        await this.mailService.addEmailToQueue({to:recipientEmail, subject: "You've been dashed a new Gift", html:sendgiftTemplate})
    }
}