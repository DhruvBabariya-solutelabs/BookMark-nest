import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateBookMarkDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MaxLength(50)
  description: string;

  @IsString()
  link: string;
}
