import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'O conteúdo principal do post, em formato de texto',
    example: 'Neste post, iremos tratar da Segunda Guerra Mundial...',
  })
  @IsNotEmpty()
  @IsString()
  // TODO: Considerar renomear para 'content' em uma refatoração futura para maior clareza.
  description: string;

  @ApiProperty({
    description: 'O título do post',
    example: 'Aula História: Segunda Guerra Mundial',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'URL da imagem para o post (opcional)',
    example: 'https://example.com/imgSegundaGuerra.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Define se o post deve ser publicado imediatamente',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;
}
