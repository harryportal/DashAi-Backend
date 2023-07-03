import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";


@injectable()
export default class AuthRepository{
    private user;
    constructor(@inject(PrismaClient)prisma:PrismaClient){
        this.user = prisma.user;
    }
}