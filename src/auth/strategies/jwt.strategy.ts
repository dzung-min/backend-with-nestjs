import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy as JWT } from 'passport-jwt';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(JWT) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.signedCookies?.Authentication,
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  validate(payload: IJwtPayload) {
    return this.authService.getUserFromJwtPayload(payload);
  }
}
