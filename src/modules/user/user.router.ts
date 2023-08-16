import { Router } from "express";
import { protect } from "../../common/auth";
import container from "../../di/inversify.config";
import UserController from "./user.controller";

const userController = container.resolve<UserController>(UserController)
export const router = Router();

router.get("/wishlists", protect(true), userController.getUserWishlist);
router.post("/", protect(true), userController.onBoardUser)
router.get("/profile", protect(true), userController.getProfile)