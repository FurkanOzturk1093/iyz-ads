import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const roleCount = await this.roleRepository.count();
    if (roleCount === 0) {
      await this.seedRolesAndUsers();
    }
  }

  private async seedRolesAndUsers() {
    // Rolleri oluştur
    const adminRole = await this.roleRepository.save({ name: 'ADMIN' });
    const managerRole = await this.roleRepository.save({
      name: 'STORE_MANAGER',
    });
    const userRole = await this.roleRepository.save({ name: 'USER' });

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Kullanıcıları oluştur
    await this.userRepository.save([
      {
        username: 'admin',
        password: hashedPassword,
        role: adminRole,
      },
      {
        username: 'manager',
        password: hashedPassword,
        role: managerRole,
      },
      {
        username: 'user',
        password: hashedPassword,
        role: userRole,
      },
    ]);

    console.log('Seed data oluşturuldu!');
  }
}
