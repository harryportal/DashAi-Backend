import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Matches, Max, Min, MinLength } from "class-validator";

export class ForgotPasswordDto{
    @IsEmail()
    email:string
}


export class SignUpDto extends ForgotPasswordDto {

    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 8 characters long, include uppercase and lowercase letters, at least one numeric digit, and at least one special character.',
    })
    password:string;
}

export class SignInDto extends ForgotPasswordDto{
    
    @IsString()
    password:string;
}

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

export class ResetPasswordDto{
    @IsString()
    token:string;

    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 8 characters long, include uppercase and lowercase letters, at least one numeric digit, and at least one special character.',
    })
    password:string

    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 8 characters long, include uppercase and lowercase letters, at least one numeric digit, and at least one special character.',
    })
    confirmPassword:string
}