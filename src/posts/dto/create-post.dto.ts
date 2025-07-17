import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  image: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublished: boolean;
}
