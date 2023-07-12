import { PrismaClient } from "@prisma/client";
import {Container} from "inversify";
import {Types as AuthTypes, IAuthRepository, IAuthService } from "../modules/auth/auth.interface";
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

const container = new Container();


container.bind(PrismaClient).toConstantValue(new PrismaClient());
container.bind<IAuthRepository>(AuthTypes.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(AuthTypes.IAuthService).to(AuthService);
container.bind<IUserRepository>(UserTypes.IUserRepository).to(UserRepository);
container.bind<IEmailQueue>(MailTypes.IEmailQueue).to(EmailQueue);
container.bind<IMailService>(MailTypes.IMailService).to(MailService);
container.bind<IUserService>(UserTypes.IUserService).to(UserService)
container.bind<IWishlistRepository>(WishlistTypes.IWishlistRepository).to(WishlistRepository);
container.bind<IWishlistService>(WishlistTypes.IWishlistService).to(WishlistService);

export default container;