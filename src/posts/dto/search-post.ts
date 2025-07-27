import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SearchPostDto {
  @ApiProperty({
    description: 'O termo de busca para filtrar posts pelo título ou conteúdo (campo obrigatório).',
    example: 'História',
    required: false, 
  })
  @IsNotEmpty()
  @IsString()
  term: string;
}
