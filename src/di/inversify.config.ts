import { Prisma, PrismaClient } from "@prisma/client";
import {Container} from "inversify";

const container = new Container();

container.bind(PrismaClient).toConstantValue(new PrismaClient());


export default container;