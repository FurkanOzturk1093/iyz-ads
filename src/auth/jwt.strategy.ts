import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Gerçek uygulamada env'den alınmalı
    });
  }

  async validate(payload: any) {
    // Debug için
    console.log('JWT payload in validate:', payload);

    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Debug için
    console.log('Found user:', user);

    // Role bilgisini de döndürelim
    return {
      id: user.id,
      username: user.username,
      role: user.role,
    };
  }
}
