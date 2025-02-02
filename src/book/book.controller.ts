import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@ApiTags('Books')
@Controller('books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Yeni kitap oluştur' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: 201, description: 'Kitap oluşturuldu' })
  async createBook(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm kitapları listele' })
  @ApiResponse({ status: 200, description: 'Kitap listesi' })
  async findAll() {
    return await this.bookService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Kitap ara' })
  @ApiQuery({ name: 'title', required: false, description: 'Kitap adı' })
  @ApiQuery({ name: 'author', required: false, description: 'Yazar adı' })
  @ApiQuery({ name: 'store', required: false, description: 'Kitapçı ID' })
  async searchBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('store') storeId?: number,
  ) {
    return await this.bookService.search(title, author, storeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kitap detaylarını getir' })
  @ApiParam({ name: 'id', description: 'Kitap ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kitap bilgilerini güncelle' })
  @ApiParam({ name: 'id', description: 'Kitap ID' })
  @ApiBody({ type: UpdateBookDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Kitap sil' })
  @ApiParam({ name: 'id', description: 'Kitap ID' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.bookService.remove(id);
  }

  @Post(':id/add-to-store/:storeId')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'STORE_MANAGER')
  @ApiOperation({ summary: 'Kitapçıya kitap ekle' })
  @ApiParam({ name: 'id', description: 'Kitap ID' })
  @ApiParam({ name: 'storeId', description: 'Kitapçı ID' })
  @ApiBody({ type: UpdateQuantityDto })
  async addToStore(
    @Param('id', ParseIntPipe) bookId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() updateDto: UpdateQuantityDto,
  ) {
    return await this.bookService.addToStore(
      bookId,
      storeId,
      updateDto.quantity,
    );
  }

  @Post(':id/remove-from-store/:storeId')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'STORE_MANAGER')
  @ApiOperation({ summary: 'Kitapçıdan kitap çıkar' })
  @ApiParam({ name: 'id', description: 'Kitap ID' })
  @ApiParam({ name: 'storeId', description: 'Kitapçı ID' })
  @ApiBody({ type: UpdateQuantityDto })
  async removeFromStore(
    @Param('id', ParseIntPipe) bookId: number,
    @Param('storeId', ParseIntPipe) storeId: number,
    @Body() updateDto: UpdateQuantityDto,
  ) {
    return await this.bookService.removeFromStore(
      bookId,
      storeId,
      updateDto.quantity,
    );
  }
}
