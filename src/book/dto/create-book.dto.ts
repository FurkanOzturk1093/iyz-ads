import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '1984', description: 'Kitap adı' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({ example: 'George Orwell', description: 'Yazar adı' })
  @IsString()
  @MinLength(2)
  author: string;

  @ApiProperty({ example: 100, description: 'Toplam kitap adedi' })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
