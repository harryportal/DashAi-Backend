import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, Matches, Max, Min, MinLength } from "class-validator";

export class ForgotPassword{
    @IsEmail()
    email:string
}


export class SignUp extends ForgotPassword {

    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Password must be at least 8 characters long, include uppercase and lowercase letters, at least one numeric digit, and at least one special character.',
    })
    password:string;
}

export class SignIn extends ForgotPassword{
    
    @IsString()
    password:string;
}

export class AddProfile {
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

export class ResetPassword{
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