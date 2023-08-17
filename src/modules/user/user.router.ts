import { Router } from "express";
import { protect } from "../../common/auth";
import container from "../../di/inversify.config";
import UserController from "./user.controller";
import RequestValidator from "../../common/validation";
import { AddProfileDto } from "./user.dtos";

const userController = container.resolve<UserController>(UserController)
export const router = Router();

router.get("/wishlists", protect(true), userController.getWishlist);
router.post("/onboarding", protect(true), RequestValidator.validate(AddProfileDto), userController.onBoardUser)
router.get("/profile", protect(true), userController.getProfile)
router.post("/favourites/:giftId", protect(true), userController.addToFavourites) 
router.get("/favourites", protect(true), userController.getFavourites )