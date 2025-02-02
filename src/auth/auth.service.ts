import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Debug için
    console.log('Login user:', user);

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role.name,
    };

    // Debug için
    console.log('JWT payload:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
