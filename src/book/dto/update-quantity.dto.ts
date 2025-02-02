import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuantityDto {
  @ApiProperty({
    example: 5,
    description: 'Eklenecek/Çıkarılacak kitap miktarı',
  })
  quantity: number;
}
