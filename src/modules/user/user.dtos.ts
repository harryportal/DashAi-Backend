import { IsIn, IsOptional, Matches, IsString } from "class-validator";


export class AddProfileDto {

    @Matches(/^(\d{2})-(\d{2})-(\d{2})$/, { message: 'Birthday must be in the format DD-MM-YY' })
    birthday:string
    
    @IsOptional()
    @IsIn(["Birthday","Christmas", "Funeral", "Eid", "Wedding", "Anniversary"], {each:true})
    giftingOccasions:string[]

    @IsString()
    purpose:string

    @IsString()
    location: string;
    
}