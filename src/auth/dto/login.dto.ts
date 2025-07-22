import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail de login do usuário.',
    example: 'aluno@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({
    description: 'Senha de acesso do usuário.',
    example: 'senhaForte123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
