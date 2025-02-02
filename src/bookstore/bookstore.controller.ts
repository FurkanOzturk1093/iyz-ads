import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
import { BookstoreService } from './bookstore.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

class CreateBookstoreDto {
  @ApiProperty({ example: 'Merkez Şube', description: 'Kitapçı adı' })
  name: string;
}

@ApiTags('Bookstores')
@Controller('bookstores')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookstoreController {
  constructor(private readonly bookstoreService: BookstoreService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Yeni kitapçı oluştur' })
  @ApiBody({ type: CreateBookstoreDto })
  @ApiResponse({ status: 201, description: 'Kitapçı oluşturuldu' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 403, description: 'Yetkisiz rol' })
  async create(@Body('name') name: string) {
    return await this.bookstoreService.create(name);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kitapçıları listele' })
  @ApiResponse({ status: 200, description: 'Kitapçı listesi' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async findAll() {
    return await this.bookstoreService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kitapçı detaylarını getir' })
  @ApiResponse({ status: 200, description: 'Kitapçı detayları' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Kitapçı bulunamadı' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookstoreService.findOne(id);
  }

  @Get(':id/inventory')
  @ApiOperation({ summary: 'Kitapçı envanterini getir' })
  @ApiResponse({ status: 200, description: 'Kitapçı envanteri' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  @ApiResponse({ status: 404, description: 'Kitapçı bulunamadı' })
  async getInventory(@Param('id', ParseIntPipe) id: number) {
    return await this.bookstoreService.getBookInventory(id);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kitapçı bilgilerini güncelle' })
  @ApiParam({ name: 'id', description: 'Kitapçı ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return await this.bookstoreService.update(id, name);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kitapçı sil' })
  @ApiParam({ name: 'id', description: 'Kitapçı ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.bookstoreService.remove(id);
  }
}
