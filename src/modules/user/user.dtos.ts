import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class AddProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    location: string;
  
    @IsString()
    @IsIn(['male', 'female', 'other'])
    gender: string;
}