import { Order, Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class OrderRepository {
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    async createOrder(data:Prisma.OrderCreateInput):Promise<Order>{
        return await this.prisma.order.create({data})
    }

    async getOrder(where:Prisma.OrderWhereUniqueInput):Promise<Order | null>{
        return await this.prisma.order.findUnique({where})
    }
}