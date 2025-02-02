import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

// Role için DTO oluşturalım
class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Rol adı' })
  name: string;
}

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni rol oluştur' })
  @ApiResponse({ status: 201, description: 'Rol oluşturuldu' })
  @ApiBody({
    type: CreateRoleDto,
    description: 'Rol oluşturma verisi',
    examples: {
      admin: {
        value: { name: 'ADMIN' },
        description: 'Admin rolü örneği',
      },
      manager: {
        value: { name: 'STORE_MANAGER' },
        description: 'Mağaza yöneticisi rolü örneği',
      },
      user: {
        value: { name: 'USER' },
        description: 'Normal kullanıcı rolü örneği',
      },
    },
  })
  async create(@Body('name') name: string) {
    return await this.roleService.create(name);
  }

  @Get()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm rolleri listele' })
  @ApiResponse({ status: 200, description: 'Rol listesi' })
  async findAll() {
    return await this.roleService.findAll();
  }
}
