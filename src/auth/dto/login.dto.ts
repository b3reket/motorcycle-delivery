import { IsEmail, IsNotEmpty, IsString, MinLength, minLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    password: string
}