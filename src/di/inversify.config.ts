import { PrismaClient } from "@prisma/client";
import {Container} from "inversify";
import {Types as AuthTypes } from "../modules/auth/auth.interface";
import { IWishlistRepository, IWishlistService, Types as WishlistTypes } from "../modules/wishlist/wishlist.interface";
import AuthRepository from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { IEmailQueue, IMailService, MailTypes } from "../modules/mail/mail.interface";
import EmailQueue from "../modules/mail/queuehandler";
import MailService from "../modules/mail/mail.service";
import {Types as UserTypes,  IUserRepository, IUserService } from "../modules/user/user.interface";
import { UserRepository } from "../modules/user/user.repository";
import { UserService } from "../modules/user/user.service";
import { WishlistRepository } from "../modules/wishlist/wishlist.repository";
import { WishlistService } from "../modules/wishlist/wishlist.service";
import { ICuratedGiftsRepository, Types as CuratedGiftsTypes, ICuratedGiftsService } from "../modules/curated-gifts/curated-gifts.interface";
import CuratedGiftRepository from "../modules/curated-gifts/curated-gifts.repository";
import { CuratedGiftsService } from "../modules/curated-gifts/curated-gifts.service";
import { IPaymentService, Types as PaymentTypes } from "../modules/payment/payment.interface";
import StripeService from "../modules/payment/payment.service";
import { Types as GiftTypes } from "../modules/gifts/gift.interface";
import GiftService from "../modules/gifts/gift.service";
import GiftRepository from "../modules/gifts/gift.repository";
import OrderRepository from "../modules/orders/order.repository";
import { OrderTypes } from "../modules/orders/order.interface";

const container = new Container();

container.bind<ICuratedGiftsRepository>(CuratedGiftsTypes.ICuratedGiftsRepository).to(CuratedGiftRepository)
container.bind<ICuratedGiftsService>(CuratedGiftsTypes.ICuratedGiftsService).to(CuratedGiftsService)
container.bind(PrismaClient).toConstantValue(new PrismaClient());
container.bind<AuthRepository>(AuthTypes.AuthRepository).to(AuthRepository);
container.bind<AuthService>(AuthTypes.AuthService).to(AuthService);
container.bind<IUserRepository>(UserTypes.IUserRepository).to(UserRepository);
container.bind<IEmailQueue>(MailTypes.IEmailQueue).to(EmailQueue);
container.bind<IMailService>(MailTypes.IMailService).to(MailService);
container.bind<IUserService>(UserTypes.IUserService).to(UserService)
container.bind<IWishlistRepository>(WishlistTypes.IWishlistRepository).to(WishlistRepository);
container.bind<IWishlistService>(WishlistTypes.IWishlistService).to(WishlistService);
container.bind<GiftRepository>(GiftTypes.GiftRepository).to(GiftRepository);
container.bind<GiftService>(GiftTypes.GiftService).to(GiftService);
container.bind<IPaymentService>(PaymentTypes.IPaymentService).to(StripeService)
container.bind<OrderRepository>(OrderTypes.OrderRepository).to(OrderRepository);

export default container;