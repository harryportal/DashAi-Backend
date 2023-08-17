import { Router } from "express";
import container from "../../di/inversify.config";
import { WishlistController } from "./wishlist.controller";
import { protect } from "../../common/auth";
import RequestValidator from "../../common/validation";
import { AddWishlistDto } from "./wishlist.dtos";

export const router = Router();

const wishlistController = container.resolve<WishlistController>(WishlistController);

router.post("/", protect(true), RequestValidator.validate(AddWishlistDto), wishlistController.createWishlist)
router.get("/:id", protect(true), wishlistController.getWishlist);
router.get("/share/:id", wishlistController.getWishlistwithUser)
router.post("/:wishlistId/gifts/:giftId", protect(true), wishlistController.addGiftToWishlist )