import { IsIn, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class AddProfileDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsNumber()
    @Min(1)
    @Max(150)
    age: number;
  
    @IsString()
    @IsNotEmpty()
    location: string;
  
    @IsString()
    @IsIn(['male', 'female', 'other'])
    gender: string;
}