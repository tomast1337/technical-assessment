import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';


export class RegisterUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsNotEmpty()
    address: string;
}