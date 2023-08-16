import { Router } from "express";
import container from "../../di/inversify.config";
import CartController from "./cart.controller";
import { protect } from "../../common/auth";
import RequestValidator from "../../common/validation";
import { AddGiftDto } from "./cart.dtos";

export const router = Router();
const cartController = container.resolve<CartController>(CartController);

router.get("/", protect(true), cartController.createCart)
router.patch("/:id", protect(true), RequestValidator.validate(AddGiftDto), cartController.updateCart);
router.get("/checkout/:id", protect(true), cartController.getCartCheckoutLink)
router.get("/:id", protect(true), cartController.getCart)