import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IUser, UserRole } from '../schemas/models/user.interface';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Define se o usuário está ativo. O padrão é true.',
    example: true,
    required: false, 
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'A função do usuário no sistema.',
    example: UserRole.Teacher, 
    enum: UserRole, 
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'O endereço de e-mail do novo usuário.',
    example: 'joao.silva@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Nome do novo usuário',
    example: 'João da Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A senha para o novo usuário. Deve atender aos critérios de segurança.',
    example: 'S3nh@F0rt3!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
