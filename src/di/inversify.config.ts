import { PrismaClient } from "@prisma/client";
import {Container} from "inversify";
import { AuthTypes, IAuthRepository, IAuthService } from "../modules/auth/auth.interface";
import AuthRepository from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";
import { IEmailQueue, IMailService, MailTypes } from "../modules/mail/mail.interface";
import EmailQueue from "../modules/mail/queuehandler";
import MailService from "../modules/mail/mail.service";

const container = new Container();

container.bind(PrismaClient).toConstantValue(new PrismaClient());
container.bind<IAuthRepository>(AuthTypes.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(AuthTypes.IAuthService).to(AuthService);
container.bind<IEmailQueue>(MailTypes.IEmailQueue).to(EmailQueue);
container.bind<IMailService>(MailTypes.IMailService).to(MailService);

export default container;