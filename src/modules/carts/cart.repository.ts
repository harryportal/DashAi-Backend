import { Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";

@injectable()
export default class CartRepository{
    constructor(@inject(PrismaClient)private readonly prisma:PrismaClient){}

    async createCart(data:Prisma.CartCreateInput){
        return await this.prisma.cart.create({data});
    }

    async updateCart(where:Prisma.CartWhereUniqueInput, data:Prisma.CartUpdateInput){
        return await this.prisma.cart.update({
            where, data
        })
    }

    async getCart(where:Prisma.CartWhereUniqueInput){
        return await this.prisma.cart.findUnique({where})
    }
}