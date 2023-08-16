import { inject, injectable } from "inversify";
import { Types } from "./gift.interface";
import { AuthRequest } from "../auth/auth.interface";
import { Response } from "express";
import { SendGiftsDto } from "./gift.dtos";
import GiftService from "./gift.service";

@injectable()
export default class GiftController {
    constructor(@inject(Types.GiftService)private readonly giftService:GiftService){}
    
}