import { IsUUID, IsBoolean, IsEmail, IsString, IsNumber, ValidateNested, IsOptional} from "class-validator";

export class SendGiftsDto{
    @IsString()
    recipientName: string;

    @IsEmail()
    recipientEmail: string;

    @IsOptional()
    @IsString()
    message: string

    @IsBoolean()
    isAnonymous:boolean

    @ValidateNested()
    gifts:GiftsDto[]
}

export class GiftsDto {
    @IsUUID('4')
    id: string

    @IsNumber()
    quantity:number
}