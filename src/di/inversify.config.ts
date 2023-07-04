import { PrismaClient } from "@prisma/client";
import {Container} from "inversify";
import { AuthTypes, IAuthRepository, IAuthService } from "../modules/auth/auth.dto";
import AuthRepository from "../modules/auth/auth.repository";
import { AuthService } from "../modules/auth/auth.service";

const container = new Container();

container.bind(PrismaClient).toConstantValue(new PrismaClient());
container.bind<IAuthRepository>(AuthTypes.IAuthRepository).to(AuthRepository);
container.bind<IAuthService>(AuthTypes.IAuthService).to(AuthService);


export default container;