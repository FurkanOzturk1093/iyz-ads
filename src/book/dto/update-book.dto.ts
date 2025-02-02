import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({ example: '1984', description: 'Kitap adı', required: false })
  title?: string;

  @ApiProperty({
    example: 'George Orwell',
    description: 'Yazar adı',
    required: false,
  })
  author?: string;

  @ApiProperty({ example: 10, description: 'Kitap adedi', required: false })
  quantity?: number;

  @ApiProperty({ example: 1, description: 'Kitapçı ID', required: false })
  bookstoreId?: number;
}
