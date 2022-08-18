import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { IJwtPayload } from 'src/interfaces/jwt-payload.interface';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getValidatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOneByEmail(email);
      await this.checkValidPassword(password, user.password);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  getUserFromJwtPayload(payload: IJwtPayload) {
    return this.usersService.findOneByID(payload.userId);
  }

  async checkValidPassword(plaintextPassword: string, hashedPassword: string) {
    const isMatch = await compare(plaintextPassword, hashedPassword);
    if (!isMatch) throw new BadRequestException("Password doesn't match");
  }

  signup(signupData: CreateUserDto) {
    return this.usersService.create(signupData);
  }

  setAuthCookie(user: User, res: Response) {
    const payload: IJwtPayload = { userId: user.id };
    const token = this.jwtService.sign(payload);
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: Number(this.configService.get('JWT_EXPIRATION_TIME')) * 1000,
      signed: true,
    });
  }
}
