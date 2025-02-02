import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

// Önce bir tip tanımlayalım
type UserResponse = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: {
    username: string;
    password: string;
    roleId: number;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      username: userData.username,
      password: hashedPassword,
      role: { id: userData.roleId },
    });
    return await this.userRepository.save(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      relations: ['role'],
    });

    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }
}
