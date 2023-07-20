import { IsEmail, IsString } from "class-validator";

export class SendGiftsDto{
    @IsString()
    recipientName: string;

    @IsEmail()
    recipientEmail: string;

    @IsString()
    message: string
}