import { Router } from "express";
import container from "../../di/inversify.config";
import GiftController from "./gift.controller";
import { protect } from "../../common/auth";
import RequestValidator from "../../common/validation";
import { SendGiftsDto } from "./gift.dtos";



const giftController = container.resolve<GiftController>(GiftController)
export const router = Router();

router.post("/send/:id", protect(true), RequestValidator.validate(SendGiftsDto), giftController.sendGift)