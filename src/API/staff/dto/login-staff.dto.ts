import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginStaffDto {
    @ApiProperty({ default: '' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ default: '' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
