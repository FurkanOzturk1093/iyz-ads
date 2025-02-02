import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(name: string): Promise<Role> {
    const role = this.roleRepository.create({ name });
    return await this.roleRepository.save(role);
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.roleRepository.findOne({ where: { name } });
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}
