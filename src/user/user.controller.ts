import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Kullanıcı oluşturuldu' })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcı listesi' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı profilini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili' })
  getProfile(@Request() req) {
    return req.user;
  }
}
