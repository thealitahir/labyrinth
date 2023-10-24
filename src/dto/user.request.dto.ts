import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

/**
   * @remarks
     Dto for User
   *
*/
export class UserDto {
  @IsString({ message: 'name must be a string' })
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
