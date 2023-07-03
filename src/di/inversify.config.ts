import { PrismaClient } from "@prisma/client";
import {Container} from "inversify";
import { AuthTypes, IAuthRepository } from "../modules/auth/auth.dto";
import AuthRepository from "../modules/auth/auth.repository";

const container = new Container();

container.bind(PrismaClient).toConstantValue(new PrismaClient());
container.bind<IAuthRepository>(AuthTypes.IAuthRepository).to(AuthRepository);

export default container;