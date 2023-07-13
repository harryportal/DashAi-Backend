import { IsOptional, IsString } from "class-validator";

export class AddWishlistDto {
    @IsString()
    name:string

    @IsString()
    description:string
}

export class GetWishlistDto{
    @IsString()
    @IsOptional()
    id:string;
    
    @IsString()
    @IsOptional()
    shortId:string;
}