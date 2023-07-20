import { Router } from "express"; 
import container from "../../di/inversify.config";
import CuratedGiftsController from "./curated-gifts.controller";
import { protect } from "../../common/auth";

const curatedGiftsController = container.resolve<CuratedGiftsController>(CuratedGiftsController);

export const router = Router();

router.get("", protect(true), curatedGiftsController.getAllCuratedGifts);
router.get("/:id",protect(true), curatedGiftsController.getCuratedGifts);