import { Router } from "express";
import container from "../../di/inversify.config";
import CartController from "./cart.controller";
import { protect } from "../../common/auth";
import RequestValidator from "../../common/validation";
import { AddGiftDto } from "./cart.dtos";

const router = Router();
const cartController = container.resolve<CartController>(CartController);

router.post("/", protect(true), cartController.createCart)
router.patch("/", protect(true), RequestValidator.validate(AddGiftDto), cartController.updateCart)