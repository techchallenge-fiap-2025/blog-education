import {
  IsBoolean,
  isBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IUser, UserRole } from '../schemas/models/user.interface';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
