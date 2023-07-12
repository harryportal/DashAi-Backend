import { IsString } from "class-validator";

export class AddWishlistDto {
    @IsString()
    name:string

    @IsString()
    description:string
}