import { Cart, Gift } from "@prisma/client";

export const CartTypes = {
    CartRepo:Symbol.for("CartRepository"),
    CartService:Symbol.for("CartService")
}

export interface ICartCheckout {
    name:string;
    amount:number;
    imageUrl:string;
    quantity:number;
}

export interface ICartGifts extends Cart {
    gifts: Gift[]
}