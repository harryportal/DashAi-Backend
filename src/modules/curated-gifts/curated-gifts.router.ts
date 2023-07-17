import { Router } from "express"; 
import container from "../../di/inversify.config";
import CuratedGiftsController from "./curated-gifts.controller";
import { protect } from "../../common/auth";

const curatedGiftsController = container.resolve<CuratedGiftsController>(CuratedGiftsController);

export const router = Router();

router.get("", curatedGiftsController.getAllCuratedGifts);
router.get("/:id", curatedGiftsController.getCuratedGifts);