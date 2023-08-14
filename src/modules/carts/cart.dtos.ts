import { IsNumber, IsUUID } from "class-validator"

export class AddGiftDto {
    @IsUUID('4')
    id: string

    @IsNumber()
    quantity:number
}